package server

import (
	"database/sql"
	"fmt"
	"strings"
)

var (
	seedEmployees = []employee{
		{
			Alias: "karakuse",
			Name:  "Efe Karakus",
			Org:   "AWS Elastic Container Service (6836)",
		},
		{
			Alias: "megpol",
			Name:  "Meghna Polimera",
			Org:   "Alexa Shopping - Tech (7875)",
		},
	}
)

type DB struct {
	Conn *sql.DB
}

type employee struct {
	Alias string `json:"alias"`
	Name  string `json:"name"`
	Org   string `json:"org"`
}

func (db *DB) Setup() error {
	_, err := db.Conn.Exec(`CREATE TABLE IF NOT EXISTS phonetool (alias VARCHAR(255) NOT NULL UNIQUE, name VARCHAR(255) NOT NULL, org VARCHAR(255) NOT NULL)`)
	if err != nil {
		return fmt.Errorf(`server: create "phonetool" table: %v\n`, err)
	}
	var valueStrings []string
	var valueArgs []interface{}
	for i, seed := range seedEmployees {
		valueStrings = append(valueStrings, fmt.Sprintf("($%d, $%d, $%d)", i*3+1, i*3+2, i*3+3))
		valueArgs = append(valueArgs, seed.Alias, seed.Name, seed.Org)
	}
	stmt := fmt.Sprintf("INSERT INTO phonetool (alias, name, org) VALUES %s ON CONFLICT DO NOTHING",
		strings.Join(valueStrings, ","))
	if _, err := db.Conn.Exec(stmt, valueArgs...); err != nil {
		return fmt.Errorf("server: store batch employees: %v", err)
	}
	return nil
}

func (db *DB) SelectAll() ([]employee, error) {
	rows, err := db.Conn.Query(`SELECT alias, name, org FROM phonetool LIMIT 10`)
	if err != nil {
		return nil, fmt.Errorf("server: retrieve employees: %v", err)
	}
	defer rows.Close()

	var results []employee
	for rows.Next() {
		var emp employee
		if err := rows.Scan(&emp.Alias, &emp.Name, &emp.Org); err != nil {
			return nil, fmt.Errorf("vote: scan employee: %v", err)
		}
		results = append(results, emp)
	}
	return results, nil
}

func (db *DB) DropAll() error {
	_, err := db.Conn.Exec(`DROP TABLE IF EXISTS phonetool`)
	if err != nil {
		return fmt.Errorf(`server: drop "phonetool" table: %v\n`, err)
	}
	return nil
}
