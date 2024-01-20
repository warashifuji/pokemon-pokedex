package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
)

const baseURL = "http://pokeapi.co/api/v2/"

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
}

func fetchPokemonData(url string, ch chan<- []byte) {
	resp, err := http.Get(url)
	if err != nil {
		log.Printf("Error fetching data: %v", err)
		ch <- nil
		return
	}
	defer resp.Body.Close()
	//bodyは[]byte(バイトスライス)として返される
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error reading response body: %v", err)
		return
	}
	ch <- body
}

func getPokemonList(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	ch := make(chan []byte)
	go fetchPokemonData(baseURL+"pokemon", ch)
	body := <-ch
	if body == nil {
		http.Error(w, "Failed to fetch pokemon list", http.StatusInternalServerError)
		return
	}

	var pokemonList PokemonListResponse
	//json->go構造体　Unmarshalの第一引数には[]byte型
	err := json.Unmarshal(body, &pokemonList)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// go -> json
	jsonData, err := json.Marshal(pokemonList)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func getPokemonDetail(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	// URLからポケモンの名前を取得
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 3 {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	pokemonName := parts[2]

	ch := make(chan []byte)
	go fetchPokemonData(baseURL+"pokemon/"+pokemonName, ch)
	body := <-ch
	if body == nil {
		http.Error(w, "Failed to fetch pokemon Detail", http.StatusInternalServerError)
		return
	}

	var pokemonDetail PokemonDetailResponse
	err := json.Unmarshal(body, &pokemonDetail)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// go -> json
	jsonData, err := json.Marshal(pokemonDetail)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)

}

func main() {
	http.HandleFunc("/pokemon", getPokemonList)
	http.HandleFunc("/pokemon/", getPokemonDetail)
	fmt.Println("Start server at port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
