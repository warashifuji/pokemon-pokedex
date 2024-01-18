package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
)

type PokemonListResponse struct {
	Count    int    `json:"count"`
	Next     string `json:"next"`
	Previous string `json:"previous"`
	Results  []struct {
		Name string `json:"name"`
		Url  string `json:"url"`
	} `json:"results"`
}

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
	jsonData, err := json.Marshal(pokemonList)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonData)
}

func main() {
	http.HandleFunc("/pokemon", getPokemonList)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
