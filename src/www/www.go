package www

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
	"www/postgres"
	"www/server"

	"github.com/gorilla/mux"
)

// Run starts the server.
func Run() error {
	addr := flag.String("addr", ":8080", "port to listen on")
	setup := flag.Bool("setup", false, "create table and populate with data")
	flag.Parse()

	secret := struct {
		Host     string `json:"host"`
		Username string `json:"username"`
		Password string `json:"password"`
		DBName   string `json:"dbname"`
		Port     int    `json:"port"`
	}{}
	if err := json.Unmarshal([]byte(os.Getenv("WWWCLUSTER_SECRET")), &secret); err != nil {
		return fmt.Errorf("api: unmarshal rds secret: %v", err)
	}

	conn, close, err := postgres.Connect(
		secret.Host,
		secret.Port,
		secret.Username,
		secret.Password,
		secret.DBName,
		os.Getenv("DB_SSL_MODE"),
	)
	if err != nil {
		return fmt.Errorf("api: connect to postgres db: %v", err)
	}
	defer close()

	db := &server.DB{
		Conn: conn,
	}
	if *setup {
		return db.Setup()
	}
	s := http.Server{
		Addr: *addr,
		Handler: &server.Server{
			Router: mux.NewRouter(),
			DB:     db,
		},
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
	}
	log.Printf("listen on port %s\n", *addr)
	return s.ListenAndServe()
}
