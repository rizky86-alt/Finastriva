package main

import (
	"database/sql"
	"fmt"
	"log"
	"golang.org/x/crypto/bcrypt"
	_ "github.com/lib/pq"
)

func main() {
	connStr := "user=postgres password=KINGKONG69 dbname=finastriva host=127.0.0.1 sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	var id int
	var username, password string
	err = db.QueryRow("SELECT id, username, password FROM users WHERE username = 'superadmin'").Scan(&id, &username, &password)
	if err != nil {
		log.Fatal("User not found in DB:", err)
	}

	fmt.Printf("User Found: ID=%d, Username='%s'\n", id, username)
	fmt.Printf("Hash in DB: '%s' (Length: %d)\n", password, len(password))

	testPass := "superadmin123"
	err = bcrypt.CompareHashAndPassword([]byte(password), []byte(testPass))
	if err != nil {
		fmt.Printf("Verification for '%s' FAILED: %v\n", testPass, err)
	} else {
		fmt.Printf("Verification for '%s' SUCCESS!\n", testPass)
	}
}
