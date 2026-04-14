package main

import (
	"database/sql"
	"fmt"
	"log"

	"golang.org/x/crypto/bcrypt"
	_ "github.com/lib/pq"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func main() {
	connStr := "user=postgres password=KINGKONG69 dbname=finastriva host=127.0.0.1 sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// 1. Drop and Recreate tables to ensure clean state
	fmt.Println("Cleaning database...")
	_, err = db.Exec(`DROP TABLE IF EXISTS transactions; DROP TABLE IF EXISTS users;`)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Creating tables...")
	_, err = db.Exec(`
		CREATE TABLE users (
			id SERIAL PRIMARY KEY,
			username VARCHAR(50) UNIQUE NOT NULL,
			password TEXT NOT NULL,
			role VARCHAR(20) DEFAULT 'user',
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);

		CREATE TABLE transactions (
			id SERIAL PRIMARY KEY,
			amount INT NOT NULL,
			description TEXT NOT NULL,
			type VARCHAR(20) NOT NULL,
			user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);
	`)
	if err != nil {
		log.Fatal(err)
	}

	// 2. Insert Super Admin
	fmt.Println("Inserting Super Admin (admin/admin123)...")
	adminPass, _ := HashPassword("admin123")
	var adminID int
	err = db.QueryRow(`INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id`, "admin", adminPass, "admin").Scan(&adminID)
	if err != nil {
		log.Fatal(err)
	}

	// 3. Insert Dummy Users
	fmt.Println("Inserting dummy users...")
	users := []string{"budi", "siti", "agus"}
	userIDs := make(map[string]int)
	for _, u := range users {
		pass, _ := HashPassword("password123")
		var id int
		err = db.QueryRow(`INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id`, u, pass, "user").Scan(&id)
		if err != nil {
			log.Fatal(err)
		}
		userIDs[u] = id
	}

	// 4. Insert Dummy Transactions
	fmt.Println("Inserting dummy transactions...")
	// Admin transactions
	db.Exec(`INSERT INTO transactions (amount, description, type, user_id) VALUES ($1, $2, $3, $4)`, 5000000, "Admin Bonus", "income", adminID)
	
	// Budi transactions
	db.Exec(`INSERT INTO transactions (amount, description, type, user_id) VALUES ($1, $2, $3, $4)`, 2000000, "Freelance", "income", userIDs["budi"])
	db.Exec(`INSERT INTO transactions (amount, description, type, user_id) VALUES ($1, $2, $3, $4)`, 50000, "Kopi", "expense", userIDs["budi"])

	// Siti transactions
	db.Exec(`INSERT INTO transactions (amount, description, type, user_id) VALUES ($1, $2, $3, $4)`, 3500000, "Gaji Bulanan", "income", userIDs["siti"])

	fmt.Println("Database seeded successfully with new admin: admin / admin123")
}
