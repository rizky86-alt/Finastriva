package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
    "context" // Tambahkan ini
    "google.golang.org/api/option" // Tambahkan ini
    "github.com/google/generative-ai-go/genai" // Tambahkan ini
    "os" // Untuk baca API Key dari .env

	"golang.org/x/crypto/bcrypt"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq" // Driver PostgreSQL
)

// Struktur data User
type User struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Password  string    `json:"password,omitempty"`
	Roles     []string  `json:"roles"`
	CreatedAt string    `json:"created_at,omitempty"`
}

// Custom Claims untuk JWT
type CustomClaims struct {
	Username string   `json:"username"`
	Roles    []string `json:"roles"`
	jwt.RegisteredClaims
}

// Struktur data Transaksi
type Transaction struct {
	ID        int    `json:"id"`
	Amount    int    `json:"amount"`
	Desc      string `json:"desc"`
	Type      string `json:"type"`       
	CreatedAt string `json:"created_at"` 
}

var db *sql.DB
var jwtKey = []byte("rahasia_negara_finastriva_2026") 

// --- LOGIKA KEAMANAN ---

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func GenerateToken(username string, roles []string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &CustomClaims{
		Username: username,
		Roles:    roles,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   username,
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}

// --- HANDLERS KEAMANAN ---

func JSONError(w http.ResponseWriter, message string, code int) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(code)
    json.NewEncoder(w).Encode(map[string]string{"error": message})
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
    var user User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        JSONError(w, "Gagal baca data", http.StatusBadRequest)
        return
    }

    if user.Username == "" || user.Password == "" {
        JSONError(w, "Username dan Password wajib diisi", http.StatusBadRequest)
        return
    }

    tx, err := db.Begin()
    if err != nil {
        JSONError(w, "Gagal memulai transaksi", http.StatusInternalServerError)
        return
    }

    hashedPassword, _ := HashPassword(user.Password)

    var userID int
    query := `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`
    err = tx.QueryRow(query, user.Username, hashedPassword).Scan(&userID)
    
    if err != nil {
        tx.Rollback()
        JSONError(w, "Username sudah terpakai", http.StatusBadRequest)
        return
    }

    // Assign default 'user' role
    var roleID int
    err = tx.QueryRow(`SELECT id FROM roles WHERE name = 'user'`).Scan(&roleID)
    if err == nil {
        tx.Exec(`INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)`, userID, roleID)
    }

    tx.Commit()

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"message": "User berhasil terdaftar!"})
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
    var input User
    if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
        JSONError(w, "Gagal baca data", http.StatusBadRequest)
        return
    }

    query := `
        SELECT u.id, u.username, u.password, r.name 
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        WHERE u.username = $1`
    
    rows, err := db.Query(query, input.Username)
    if err != nil {
        JSONError(w, "Error database: "+err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var dbUser struct {
        ID       int
        Username string
        Password string
    }
    var roles []string
    found := false
    
    for rows.Next() {
        var id int
        var username, password string
        var roleName sql.NullString
        
        err := rows.Scan(&id, &username, &password, &roleName)
        if err != nil {
            continue
        }
        
        if !found {
            dbUser.ID = id
            dbUser.Username = username
            dbUser.Password = password
            found = true
        }
        
        if roleName.Valid {
            roles = append(roles, roleName.String)
        }
    }

    if !found || !CheckPasswordHash(input.Password, dbUser.Password) {
        JSONError(w, "Username atau Password salah!", http.StatusUnauthorized)
        return
    }

    token, _ := GenerateToken(dbUser.Username, roles)
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]interface{}{
        "token":    token,
        "username": dbUser.Username,
        "roles":    roles,
    })
}

// --- MIDDLEWARE ---

func CORSMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        fmt.Printf("[%s] %s %s from %s\n", time.Now().Format("15:04:05"), r.Method, r.URL.Path, r.RemoteAddr)
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        next.ServeHTTP(w, r)
    })
}

func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        authHeader := r.Header.Get("Authorization")
        if authHeader == "" {
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusUnauthorized)
            json.NewEncoder(w).Encode(map[string]string{"error": "Akses ditolak: Token tidak ditemukan"})
            return
        }

        tokenString := ""
        if len(authHeader) >= 7 && authHeader[:7] == "Bearer " {
            tokenString = authHeader[7:]
        } else {
            tokenString = authHeader
        }

        claims := &CustomClaims{}
        token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
            return jwtKey, nil
        })

        if err != nil || !token.Valid {
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusUnauthorized)
            json.NewEncoder(w).Encode(map[string]string{"error": "Akses ditolak: Token tidak sah"})
            return
        }

        r.Header.Set("X-User-Name", claims.Username)
        rolesJSON, _ := json.Marshal(claims.Roles)
        r.Header.Set("X-User-Roles", string(rolesJSON))
        
        next.ServeHTTP(w, r)
    }
}

func AdminMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        rolesStr := r.Header.Get("X-User-Roles")
        var roles []string
        json.Unmarshal([]byte(rolesStr), &roles)
        
        isAdmin := false
        for _, r := range roles {
            if r == "admin" || r == "superadmin" {
                isAdmin = true
                break
            }
        }

        if !isAdmin {
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusForbidden)
            json.NewEncoder(w).Encode(map[string]string{"error": "Akses ditolak: Anda bukan admin"})
            return
        }
        next.ServeHTTP(w, r)
    }
}

// --- ADMIN HANDLERS ---

func GetUsersHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    
    query := `
        SELECT u.id, u.username, u.created_at, r.name 
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.user_id
        LEFT JOIN roles r ON ur.role_id = r.id
        ORDER BY u.id ASC`
    
    rows, err := db.Query(query)
    if err != nil {
        JSONError(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    userMap := make(map[int]*User)
    var userIDs []int

    for rows.Next() {
        var id int
        var username string
        var createdAt string
        var roleName sql.NullString
        
        err := rows.Scan(&id, &username, &createdAt, &roleName)
        if err != nil {
            continue
        }

        if _, ok := userMap[id]; !ok {
            userMap[id] = &User{
                ID:        id,
                Username:  username,
                CreatedAt: createdAt,
                Roles:     []string{},
            }
            userIDs = append(userIDs, id)
        }

        if roleName.Valid {
            userMap[id].Roles = append(userMap[id].Roles, roleName.String)
        }
    }

    users := []User{}
    for _, id := range userIDs {
        users = append(users, *userMap[id])
    }
    
    json.NewEncoder(w).Encode(users)
}

func initDB() {
	connStr := "user=postgres password=KINGKONG69 dbname=finastriva host=127.0.0.1 sslmode=disable"
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	
	err = db.Ping()
	if err != nil {
		log.Fatal("Gak bisa konek ke database:", err)
	}
	fmt.Println("Mantap! Terhubung ke PostgreSQL")
}

func AskAIHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    
    // 1. Identitas User (dari middleware)
    currentUser := r.Header.Get("X-User-Name")

    // 2. Baca Pertanyaan User dari JSON
    var input struct {
        Question string `json:"question"`
    }
    json.NewDecoder(r.Body).Decode(&input)

    // 3. Siapkan Konteks Transaksi
    history := getFinancialContext(currentUser)

    // 4. Inisialisasi Gemini Client
    ctx := context.Background()

    apiKey := os.Getenv("GEMINI_API_KEY")
    if apiKey == "" {
        fmt.Println("AI Error: GEMINI_API_KEY is missing from .env")
        JSONError(w, "Konfigurasi AI (API Key) tidak ditemukan.", 500)
        return
    }

    client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
    if err != nil {
        fmt.Println("AI Error: Failed to connect to AI Service:", err)
        JSONError(w, "Gagal terhubung ke layanan AI.", 500)
        return
    }
    defer client.Close()

    model := client.GenerativeModel("gemini-2.0-flash")

    // 5. PROMPT ENGINEERING (Detail Instruksi)
    prompt := fmt.Sprintf(`
        Nama kamu adalah Finastriva Oracle. Kamu asisten keuangan cerdas.
        Tugas: Analisis riwayat transaksi di bawah dan jawab pertanyaan user secara solutif.
        Gaya Bicara: Profesional, tech-savvy, singkat, dan gunakan Bahasa Indonesia yang baik.
        
        %s
        
        Pertanyaan User: %s
    `, history, input.Question)

    // 6. Generate Jawaban
    fmt.Println("AI: Generating response for", currentUser)
    resp, err := model.GenerateContent(ctx, genai.Text(prompt))
    if err != nil {
        fmt.Println("AI Error: Gemini failed to respond:", err)
        JSONError(w, "AI sedang sibuk atau mengalami kendala teknis. Coba lagi nanti.", 500)
        return
    }

    // Ambil teks dari response Gemini
    var aiReply string
    for _, cand := range resp.Candidates {
        for _, part := range cand.Content.Parts {
            aiReply += fmt.Sprintf("%v", part)
        }
    }

    json.NewEncoder(w).Encode(map[string]string{"reply": aiReply})
}

func getFinancialContext(username string) string {
    // Ambil 15 transaksi terakhir buat jadi "bahan bacaan" Gemini
    rows, err := db.Query(`
        SELECT t.amount, t.description, t.type 
        FROM transactions t
        JOIN users u ON t.user_id = u.id
        WHERE u.username = $1
        ORDER BY t.created_at DESC LIMIT 15`, username)
    
    if err != nil {
        return "Gagal mengambil data transaksi."
    }
    defer rows.Close()

    contextText := "Berikut adalah riwayat transaksi terakhir saya:\n"
    for rows.Next() {
        var amount int
        var desc, tType string
        rows.Scan(&amount, &desc, &tType)
        contextText += fmt.Sprintf("- [%s] %s senilai Rp %d\n", tType, desc, amount)
    }
    return contextText
}

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		fmt.Println("Warning: .env file not found")
	}

	initDB()
	defer db.Close()

    mux := http.NewServeMux()

    mux.HandleFunc("/api/register", RegisterHandler)
    mux.HandleFunc("/api/login", LoginHandler)
    mux.HandleFunc("/api/admin/users", AuthMiddleware(AdminMiddleware(func(w http.ResponseWriter, r *http.Request) {
        if (r.Method == "GET") {
            GetUsersHandler(w, r)
        } else if (r.Method == "DELETE") {
            // Check if superadmin
            rolesStr := r.Header.Get("X-User-Roles")
            var roles []string
            json.Unmarshal([]byte(rolesStr), &roles)
            isSuper := false
            for _, r := range roles {
                if r == "superadmin" {
                    isSuper = true
                    break
                }
            }
            if !isSuper {
                JSONError(w, "Hanya Superadmin yang bisa menghapus user", http.StatusForbidden)
                return
            }

            id := r.URL.Query().Get("id")
            if id == "" {
                JSONError(w, "ID user diperlukan", http.StatusBadRequest)
                return
            }

            _, err := db.Exec("DELETE FROM users WHERE id = $1", id)
            if err != nil {
                JSONError(w, "Gagal menghapus user: "+err.Error(), http.StatusInternalServerError)
                return
            }
            w.WriteHeader(http.StatusOK)
            json.NewEncoder(w).Encode(map[string]string{"message": "User berhasil dihapus"})
        } else {
            w.WriteHeader(http.StatusMethodNotAllowed)
        }
    })))
    // Pastikan dibungkus AuthMiddleware biar cuma user login yang bisa tanya AI
    mux.HandleFunc("/api/ai/ask", AuthMiddleware(AskAIHandler))

	mux.HandleFunc("/api/transactions", AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        currentUser := r.Header.Get("X-User-Name")

        if r.Method == "GET" {
            query := `
                SELECT t.id, t.amount, t.description, t.type, t.created_at 
                FROM transactions t
                JOIN users u ON t.user_id = u.id
                WHERE u.username = $1
                ORDER BY t.created_at DESC`
            
            rows, err := db.Query(query, currentUser)
            if err != nil {
                JSONError(w, err.Error(), http.StatusInternalServerError)
                return
            }
            defer rows.Close()

            ts := []Transaction{}
            for rows.Next() {
                var t Transaction
                rows.Scan(&t.ID, &t.Amount, &t.Desc, &t.Type, &t.CreatedAt)
                ts = append(ts, t)
            }
            json.NewEncoder(w).Encode(ts)

        } else if r.Method == "POST" {
            var t Transaction
            if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
                JSONError(w, "Data tidak valid", http.StatusBadRequest)
                return
            }

            query := `
                INSERT INTO transactions (amount, description, type, user_id) 
                VALUES ($1, $2, $3, (SELECT id FROM users WHERE username = $4)) 
                RETURNING id, created_at`
            
            err := db.QueryRow(query, t.Amount, t.Desc, t.Type, currentUser).Scan(&t.ID, &t.CreatedAt)
            if err != nil {
                JSONError(w, err.Error(), http.StatusInternalServerError)
                return
            }
            json.NewEncoder(w).Encode(t)

        } else if r.Method == "DELETE" {
            id := r.URL.Query().Get("id")
            query := `
                DELETE FROM transactions 
                WHERE id = $1 AND user_id = (SELECT id FROM users WHERE username = $2)`
            
            res, err := db.Exec(query, id, currentUser)
            if err != nil {
                JSONError(w, err.Error(), http.StatusInternalServerError)
                return
            }
            rows, _ := res.RowsAffected()
            if rows == 0 {
                JSONError(w, "Data tidak ditemukan", http.StatusNotFound)
                return
            }
            w.WriteHeader(http.StatusOK)
            json.NewEncoder(w).Encode(map[string]string{"message": "Berhasil dihapus"})
    
        } else if r.Method == "PUT" {
            id := r.URL.Query().Get("id")
            var t Transaction
            if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
                JSONError(w, "Data tidak valid", http.StatusBadRequest)
                return
            }

            query := `
                UPDATE transactions 
                SET amount = $1, description = $2, type = $3 
                WHERE id = $4 AND user_id = (SELECT id FROM users WHERE username = $5)`
            
            res, err := db.Exec(query, t.Amount, t.Desc, t.Type, id, currentUser)
            if err != nil {
                JSONError(w, err.Error(), http.StatusInternalServerError)
                return
            }
            rows, _ := res.RowsAffected()
            if rows == 0 {
                JSONError(w, "Data tidak ditemukan", http.StatusNotFound)
                return
            }
            w.WriteHeader(http.StatusOK)
            json.NewEncoder(w).Encode(map[string]string{"message": "Data berhasil diperbarui"})
        }
    }))

	fmt.Println("Backend Finastriva jalan di http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", CORSMiddleware(mux)))
}
