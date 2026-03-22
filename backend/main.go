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
	Type   string `json:"type"` // "income" atau "expense"
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
			json.NewEncoder(w).Encode(transactions)
		} else if r.Method == "POST" {
			var newTrans Transaction
			json.NewDecoder(r.Body).Decode(&newTrans)
			newTrans.ID = len(transactions) + 1
			transactions = append(transactions, newTrans)
			json.NewEncoder(w).Encode(newTrans)
		}
	})

	http.ListenAndServe(":8080", nil)
}
