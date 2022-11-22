package main

import (
	"log"
	"www"
)

func main() {
	if err := www.Run(); err != nil {
		log.Fatalf("run api server: %v\n", err)
	}
}
