package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Halo dari Golang! Finastriva Backend Ready!"})
	})

	fmt.Println("Backend jalan di http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}