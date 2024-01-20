package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"
)

const baseURL = "http://pokeapi.co/api/v2/"

func getPokemonList(w http.ResponseWriter, r *http.Request) {
	resp, err := http.Get(baseURL + "pokemon")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()
	//bodyは[]byte(バイトスライス)として返される
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	var pokemonList PokemonListResponse
	//json->go構造体　Unmarshalの第一引数には[]byte型
	err = json.Unmarshal(body, &pokemonList)
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
	// URLからポケモンの名前を取得
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 3 {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	pokemonName := parts[2]
	resp, err := http.Get(baseURL + "pokemon/" + pokemonName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

}

func main() {
	http.HandleFunc("/pokemon", getPokemonList)
	http.HandleFunc("/pokemon/", getPokemonDetail)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
