package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/lib/pq" // Driver Postgres
)

var db *sql.DB

func initDB() {
	connStr := "user=postgres password=KINGKONG69 dbname=finastriva sslmode=disable"
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	// Cek koneksi
	err = db.Ping()
	if err != nil {
		log.Fatal("Waduh, gak bisa konek ke database:", err)
	}
	fmt.Println("Mantap! Terhubung ke PostgreSQL")
}

type Transaction struct {
	ID     int    `json:"id"`
	Amount int    `json:"amount"`
	Desc   string `json:"desc"`
}

func main() {
	initDB()
	defer db.Close()

	http.HandleFunc("/api/transactions", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "GET" {
			// AMBIL DARI DATABASE
			rows, _ := db.Query("SELECT id, amount, description FROM transactions")
			var ts []Transaction
			for rows.Next() {
				var t Transaction
				rows.Scan(&t.ID, &t.Amount, &t.Desc)
				ts = append(ts, t)
			}
			json.NewEncoder(w).Encode(ts)

		} else if r.Method == "POST" {
			// SIMPAN KE DATABASE
			var t Transaction
			json.NewDecoder(r.Body).Decode(&t)
			query := `INSERT INTO transactions (amount, description) VALUES ($1, $2) RETURNING id`
			db.QueryRow(query, t.Amount, t.Desc).Scan(&t.ID)
			json.NewEncoder(w).Encode(t)
		}
	})

	http.ListenAndServe(":8080", nil)
}
