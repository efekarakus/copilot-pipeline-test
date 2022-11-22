package server

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

type Server struct {
	Router *mux.Router
	DB     *DB
}

// ServeHTTP delegates to the mux router.
func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.Router.HandleFunc("/_healthcheck", s.handleHealthCheck())
	s.Router.HandleFunc("/", s.displayEmployees())
	s.Router.HandleFunc("/drop", s.dropAll())
	s.Router.ServeHTTP(w, r)
}

func (s *Server) handleHealthCheck() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	}
}

func (s *Server) displayEmployees() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		employees, err := s.DB.SelectAll()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(employees)
	}
}

func (s *Server) dropAll() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := s.DB.DropAll(); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
}
