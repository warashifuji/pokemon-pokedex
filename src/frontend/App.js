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
      const pokemonUrl = `http://localhost:8080/pokemon/${pokemon.name}`
      // const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`;
      fetch(pokemonUrl)
      .then(res => res.json())
      .then(async (data) => {
        const _image = data.sprites.other["official-artwork"].front_default;
        const _type1 = data.types[0].type.name;
        const _type2 = data.types.length > 1 ? data.types[1].type.name : null;
        const _iconImage = data.sprites.other.dream_world.front_default;
        const japaneseInfo1 = await translateToJapanese(data.name, _type1);
        const japaneseInfo2 = _type2 ? await translateToJapanese(data.name, _type2) : {name: null, type: null};
        const newList = {
          id: data.id,
          name: data.name,
          image: _image,
          type1: _type1,
          type2: _type2,
          iconImage: _iconImage,
          jpName: japaneseInfo1.name,
          jpType1: japaneseInfo1.type,
          jpType2: japaneseInfo2.type,
        };
        console.log(newList);
        setAllPokemons(currentList => [...currentList, newList].sort((a, b) => a.id - b.id));
      })
    });
    
  };
  console.log(allPokemons);
  const [url, setUrl] = useState("http://localhost:8080/pokemon");
  const [isLoading, setIsLoading] = useState(false);

  const getAllPokemons = () => {
    setIsLoading(true);
    fetch(url)
      .then(resp => resp.json())
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
              jpType1={pokemon.jpType1}
              jpType2={pokemon.jpType2}
              image={pokemon.image}
              type1={pokemon.type1}
              type2={pokemon.type2}
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