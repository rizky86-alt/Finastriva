package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"golang.org/x/crypto/bcrypt"
	"github.com/golang-jwt/jwt/v5"
	_ "github.com/lib/pq" // Driver PostgreSQL
)

// Struktur data User
type User struct {
	ID        int       `json:"id"`
	Username  string    `json:"username"`
	Password  string    `json:"password,omitempty"`
	Role      string    `json:"role"`
	CreatedAt string    `json:"created_at,omitempty"`
}

// Custom Claims untuk JWT
type CustomClaims struct {
	Username string `json:"username"`
	Role     string `json:"role"`
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

func GenerateToken(username string, role string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &CustomClaims{
		Username: username,
		Role:     role,
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

    hashedPassword, _ := HashPassword(user.Password)

    query := `INSERT INTO users (username, password, role) VALUES ($1, $2, 'user')`
    _, err := db.Exec(query, user.Username, hashedPassword)
    
    if err != nil {
        JSONError(w, "Username sudah terpakai", http.StatusBadRequest)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"message": "User berhasil terdaftar!"})
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
    var input User
    var dbUser User
    
    if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
        JSONError(w, "Gagal baca data", http.StatusBadRequest)
        return
    }

    query := `SELECT id, username, password, role FROM users WHERE username = $1`
    err := db.QueryRow(query, input.Username).Scan(&dbUser.ID, &dbUser.Username, &dbUser.Password, &dbUser.Role)

    if err != nil {
        if err == sql.ErrNoRows {
            JSONError(w, "Username atau Password salah!", http.StatusUnauthorized)
        } else {
            JSONError(w, "Error database: "+err.Error(), http.StatusInternalServerError)
        }
        return
    }

    if !CheckPasswordHash(input.Password, dbUser.Password) {
        JSONError(w, "Username atau Password salah!", http.StatusUnauthorized)
        return
    }

    token, _ := GenerateToken(dbUser.Username, dbUser.Role)
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{
        "token":    token,
        "username": dbUser.Username,
        "role":     dbUser.Role,
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
        r.Header.Set("X-User-Role", claims.Role)
        
        next.ServeHTTP(w, r)
    }
}

func AdminMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        role := r.Header.Get("X-User-Role")
        if role != "admin" {
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
    
    rows, err := db.Query("SELECT id, username, role, created_at FROM users ORDER BY id ASC")
    if err != nil {
        JSONError(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var users []User
    for rows.Next() {
        var u User
        rows.Scan(&u.ID, &u.Username, &u.Role, &u.CreatedAt)
        users = append(users, u)
    }
    
    if users == nil {
        users = []User{}
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

func main() {
	initDB()
	defer db.Close()

    mux := http.NewServeMux()

    mux.HandleFunc("/api/register", RegisterHandler)
    mux.HandleFunc("/api/login", LoginHandler)
    mux.HandleFunc("/api/admin/users", AuthMiddleware(AdminMiddleware(GetUsersHandler)))

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
