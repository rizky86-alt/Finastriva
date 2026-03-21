package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// Struktur data transaksi (Sesuai kaidah Engineering)
type Transaction struct {
	ID     int    `json:"id"`
	Amount int    `json:"amount"`
	Desc   string `json:"desc"`
	Type   string `json:"type"` // "income" atau "expense"
}

func main() {
	// Dummy data (nanti kita pakai database)
	transactions := []Transaction{}

	http.HandleFunc("/api/transactions", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*") // Biar Next.js bisa akses

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

	fmt.Println("Backend Finastriva jalan di http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}
