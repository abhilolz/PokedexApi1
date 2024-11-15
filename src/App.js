import React, { useEffect, useState } from "react";
import PokemonThumb from "./components/pokemonThumb";

const App = () => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [loadMore, setLoadMore] = useState(
    "https://pokeapi.co/api/v2/pokemon?limit=10"
  );
  const loadedPokemon = new Set();

  const getAllPokemons = async () => {
    const res = await fetch(loadMore);
    const data = await res.json();

    setLoadMore(data.next);

    const fetchPromises = data.results.map(async (pokemon) => {
      if (!loadedPokemon.has(pokemon.name)) {
        loadedPokemon.add(pokemon.name);
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
        return await res.json();
      }
      return null;
    });

    const newPokemons = (await Promise.all(fetchPromises)).filter(Boolean);

    setAllPokemons((currentList) =>
      [...currentList, ...newPokemons].sort((a, b) => a.id - b.id)
    );
  };

  useEffect(() => {
    getAllPokemons();
  }, []);

  return (
    <div className="app-container">
      <h1>PokeDex</h1>
      <div className="pokemon-container">
        <div className="all-container">
          {allPokemons.map((pokemonStats) => (
            <PokemonThumb
              key={pokemonStats.id}
              id={pokemonStats.id}
              image={pokemonStats.sprites.front_default}
              name={pokemonStats.name}
              type={pokemonStats.types[0].type.name}
            />
          ))}
        </div>
        <button className="load-more" onClick={getAllPokemons}>
          Load more
        </button>
      </div>
    </div>
  );
};

export default App;
