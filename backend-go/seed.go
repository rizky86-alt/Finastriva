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

	// 1. Drop and Recreate tables to ensure clean state (Granular 5-Table RBAC)
	fmt.Println("Cleaning database (Granular RBAC Schema)...")
	_, err = db.Exec(`
		DROP TABLE IF EXISTS transactions; 
		DROP TABLE IF EXISTS user_roles; 
		DROP TABLE IF EXISTS role_permissions; 
		DROP TABLE IF EXISTS permissions; 
		DROP TABLE IF EXISTS roles; 
		DROP TABLE IF EXISTS users;
	`)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Creating Advanced RBAC tables...")
	_, err = db.Exec(`
		CREATE TABLE users (
			id SERIAL PRIMARY KEY,
			username VARCHAR(50) UNIQUE NOT NULL,
			password TEXT NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);

		CREATE TABLE roles (
			id SERIAL PRIMARY KEY,
			name VARCHAR(50) UNIQUE NOT NULL
		);

		CREATE TABLE permissions (
			id SERIAL PRIMARY KEY,
			name VARCHAR(100) UNIQUE NOT NULL
		);

		CREATE TABLE role_permissions (
			role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
			permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
			PRIMARY KEY (role_id, permission_id)
		);

		CREATE TABLE user_roles (
			user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
			role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
			PRIMARY KEY (user_id, role_id)
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

	// 2. Insert Roles & Permissions
	fmt.Println("Setting up Roles and Permissions...")
	roles := []string{"superadmin", "admin", "user"}
	roleIDs := make(map[string]int)
	for _, r := range roles {
		var id int
		db.QueryRow(`INSERT INTO roles (name) VALUES ($1) RETURNING id`, r).Scan(&id)
		roleIDs[r] = id
	}

	perms := []string{"manage_users", "manage_content", "view_all_stats"}
	permIDs := make(map[string]int)
	for _, p := range perms {
		var id int
		db.QueryRow(`INSERT INTO permissions (name) VALUES ($1) RETURNING id`, p).Scan(&id)
		permIDs[p] = id
	}

	// Assign permissions to roles
	// Superadmin gets everything
	for _, pid := range permIDs {
		db.Exec(`INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)`, roleIDs["superadmin"], pid)
	}
	// Admin gets manage_users and view_all_stats
	db.Exec(`INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)`, roleIDs["admin"], permIDs["manage_users"])
	db.Exec(`INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)`, roleIDs["admin"], permIDs["view_all_stats"])
	// User gets manage_content (personal)
	db.Exec(`INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)`, roleIDs["user"], permIDs["manage_content"])

	// 3. Insert Admins
	fmt.Println("Inserting Admins...")
	adminPass, _ := HashPassword("admin123")
	var adminID int
	db.QueryRow(`INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`, "admin", adminPass).Scan(&adminID)
	db.Exec(`INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)`, adminID, roleIDs["admin"])

	superPass, _ := HashPassword("superadmin123")
	var superID int
	db.QueryRow(`INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`, "superadmin", superPass).Scan(&superID)
	db.Exec(`INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)`, superID, roleIDs["superadmin"])

	// 4. Insert Dummy Users
	fmt.Println("Inserting dummy users...")
	dummyUsers := []string{"budi", "siti", "agus"}
	userIDs := make(map[string]int)
	for _, u := range dummyUsers {
		pass, _ := HashPassword("password123")
		var id int
		db.QueryRow(`INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`, u, pass).Scan(&id)
		db.Exec(`INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)`, id, roleIDs["user"])
		userIDs[u] = id
	}

	// 5. Insert Dummy Transactions
	fmt.Println("Inserting dummy transactions...")
	// Budi transactions
	db.Exec(`INSERT INTO transactions (amount, description, type, user_id) VALUES ($1, $2, $3, $4)`, 2000000, "Freelance", "income", userIDs["budi"])
	db.Exec(`INSERT INTO transactions (amount, description, type, user_id) VALUES ($1, $2, $3, $4)`, 50000, "Kopi", "expense", userIDs["budi"])

	// Siti transactions
	db.Exec(`INSERT INTO transactions (amount, description, type, user_id) VALUES ($1, $2, $3, $4)`, 3500000, "Gaji Bulanan", "income", userIDs["siti"])

	fmt.Println("Database seeded successfully with Advanced RBAC Schema!")
	fmt.Println("Admins: admin/admin123, superadmin/superadmin123")
}
