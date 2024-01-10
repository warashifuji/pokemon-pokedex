import { useEffect, useState } from 'react';
import './App.css';
import PokemonThumbnails from './PokemonThumbnails';

function App() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [pokemonNames, setPokemonNames] = useState([]);
  const pokemons = [
    {
      id: 1,
      name: "フシギダネ",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
      type: "くさ"
    },
    {
      id: 2,
      name: "フシギソウ",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
      type: "くさ"
    },
    {
      id: 3,
      name: "フシギバナ",
      image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
      type: "くさ"
    },
  ]

  const pokemonUrl = "https://pokeapi.co/api/v2/pokemon/bulbasaur";
  const createPokemonObject = () => {
    fetch(pokemonUrl)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        console.log(data.sprites.other["official-artwork"].front_defaut);
        console.log(data.types[0].type.name);
        console.log(data.types[1].type.name);

      })
  }
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon?limit=20");
  const getAllPokemons = () => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data.results);
        setAllPokemons(data.results);
        setUrl(data.next);
      });
    };

  useEffect(() => {
    getAllPokemons();
    createPokemonObject();
  }, []);


  return (
    <div className="app-container">
      <h1>ポケモン図鑑</h1>
      <div className='pokemon-container'>
        <div className='all-container'>
          {pokemons.map((pokemon, index) => (
            <PokemonThumbnails
              id={pokemon.id}
              name={pokemonNames[index]}
              image={pokemon.image}
              type={pokemon.type} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
