package main

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	password := "superadmin123"
	hash := "$2a$14$YzfbVKKByeIWu7fMNW4JD.ROU0ZS6LUE987qyFQj4ZIYlW/YTQxkW"
	
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		fmt.Println("Verification FAILED:", err)
	} else {
		fmt.Println("Verification SUCCESS!")
	}
}
