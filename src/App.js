import { useEffect, useState } from 'react';
import './App.css';
import PokemonThumbnails from './PokemonThumbnails';
import pokemonJson from './pokemon.json';
import pokemonTypeJson from './pokemonType.json';

function App() {
  const translateToJapanese = async (name, type) => {
    const jpName = await pokemonJson.find(
      (pokemon) => pokemon.en.toLowerCase() === name
    ).ja;
    const jpType = await pokemonTypeJson[type];
    console.log(jpType);
    return { name: jpName, type: jpType };
  }

  const [allPokemons, setAllPokemons] = useState([]);

  const createPokemonObject = (results) => {
    results.forEach(pokemon => {
      const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`;
      fetch(pokemonUrl)
      .then(res => res.json())
      .then(async (data) => {
        const _image = data.sprites.other["official-artwork"].front_default;
        const _type = data.types[0].type.name;
        const _iconImage = data.sprites.other.dream_world.front_default;
        const japaneseInfo = await translateToJapanese(data.name, _type);
        const newList = {
          id: data.id,
          name: data.name,
          image: _image,
          type: _type,
          iconImage: _iconImage,
          jpName: japaneseInfo.name,
          jpType: japaneseInfo.type
        };
        console.log(newList);
        setAllPokemons(currentList => [...currentList, newList].sort((a, b) => a.id - b.id));
      })
    });
    
  };
  console.log(allPokemons);
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon?limit=100");
  const [isLoading, setIsLoading] = useState(false);

  const getAllPokemons = () => {
    setIsLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data.results);
        createPokemonObject(data.results);
        setUrl(data.next);

      })
      .finally(() => {
        setIsLoading(false);
      });
    };

  useEffect(() => {
    getAllPokemons();
  }, []);


  return (
    <div className="app-container">
      <h1>ポケモン図鑑</h1>
      <div className='pokemon-container'>
        <div className='all-container'>
          {allPokemons.map((pokemon, index) => (
            <PokemonThumbnails
              id={pokemon.id}
              name={pokemon.name}
              jpName={pokemon.jpName}
              jpType={pokemon.jpType}
              image={pokemon.image}
              type={pokemon.type}
              iconImage={pokemon.iconImage}
              key={index} />
          ))}
        </div>
        {isLoading ? (
          <div className='load-more'>ロード中です</div>
        ) : (
          <button className='load-more' onClick={getAllPokemons}>さらに表示する</button>
        )}
      </div>
    </div>
  );
}

export default App;

