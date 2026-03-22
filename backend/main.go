package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/lib/pq" // Driver PostgreSQL
)

// Struktur data sesuai skema DB baru
type Transaction struct {
	ID        int    `json:"id"`
	Amount    int    `json:"amount"`
	Desc      string `json:"desc"`
	Type      string `json:"type"`       
	CreatedAt string `json:"created_at"` 
}

var db *sql.DB

func initDB() {
	// SESUAIKAN: password=admin123 dengan password pgAdmin kamu
	connStr := "user=postgres password=KINGKONG69 dbname=finastriva sslmode=disable"
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

	http.HandleFunc("/api/transactions", func(w http.ResponseWriter, r *http.Request) {
    // 1. SET HEADER DI PALING ATAS (Wajib untuk semua method)
    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    // Pastikan DELETE ada di daftar bawah ini
    w.Header().Set("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS") 
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

    // 2. TANGANI PRE-FLIGHT (Browser cek izin sebelum DELETE)
    if r.Method == "OPTIONS" {
        w.WriteHeader(http.StatusOK)
        return
    }

    if r.Method == "GET" {
        rows, err := db.Query("SELECT id, amount, description, type, created_at FROM transactions ORDER BY created_at DESC")
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        defer rows.Close()

        var ts []Transaction
        for rows.Next() {
            var t Transaction
            rows.Scan(&t.ID, &t.Amount, &t.Desc, &t.Type, &t.CreatedAt)
            ts = append(ts, t)
        }
        json.NewEncoder(w).Encode(ts)

    } else if r.Method == "POST" {
        var t Transaction
        json.NewDecoder(r.Body).Decode(&t)

        query := `INSERT INTO transactions (amount, description, type) VALUES ($1, $2, $3) RETURNING id, created_at`
        err := db.QueryRow(query, t.Amount, t.Desc, t.Type).Scan(&t.ID, &t.CreatedAt)
        
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        json.NewEncoder(w).Encode(t)

    } else if r.Method == "DELETE" {
        id := r.URL.Query().Get("id")
        if id == "" {
            http.Error(w, "ID tidak ditemukan", http.StatusBadRequest)
            return
        }

        _, err := db.Exec("DELETE FROM transactions WHERE id = $1", id)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        // Kirim respon JSON sukses (agar frontend tidak bingung)
        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(map[string]string{"message": "Berhasil dihapus"})
    }
})

	fmt.Println("Backend Finastriva jalan di http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}