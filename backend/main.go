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
	connStr := "user=postgres password=admin123 dbname=finastriva sslmode=disable"
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
		// Header Keamanan & CORS
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		if r.Method == "GET" {
			// Query: Ambil data terbaru di posisi teratas
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

			// Logic: Simpan ke DB dan ambil ID + Tanggal yang digenerate Postgres
			query := `INSERT INTO transactions (amount, description, type) VALUES ($1, $2, $3) RETURNING id, created_at`
			err := db.QueryRow(query, t.Amount, t.Desc, t.Type).Scan(&t.ID, &t.CreatedAt)
			
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			json.NewEncoder(w).Encode(t)
		}
	})

	fmt.Println("Backend Finastriva jalan di http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}