import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PokeInfo = () => {
  const router = useRouter();
  const { poke } = router.query;
  const pokeData = poke && JSON.parse(poke);
  const evolutionChain = pokeData.evolutionChain;

  // 진화단계 정렬
  const [species1, setSpecies1] = useState(null);
  const [species2, setSpecies2] = useState(null);
  const [species3, setSpecies3] = useState(null);

  useEffect(() => {
    const fetchEvolutionData = async () => {
      try {
        const species1Data = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${evolutionChain.species.name}`
        );

        setSpecies1(species1Data.data);

        const species2Data = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${evolutionChain.evolves_to[0].species.name}`
        );
        setSpecies2(species2Data.data);

        const species3Data = await axios.get(
          `https://pokeapi.co/api/v2/pokemon-species/${evolutionChain.evolves_to[0].evolves_to[0].species.name}`
        );
        setSpecies3(species3Data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchEvolutionData();
  }, [evolutionChain]);

  return (
    <>
      {!pokeData ? (
        ""
      ) : (
        <div className="poke__info">
          <h1>{pokeData.koreanName}</h1>
          <img
            src={pokeData.sprites.other["official-artwork"].front_default}
            width={300}
            height={300}
            alt=""
          />
          <div className="abilities">
            {pokeData.abilities.map((poke) => {
              return (
                <>
                  <div className="group">
                    <h2>{poke.ability.korean_name}</h2>
                  </div>
                </>
              );
            })}
          </div>
          <div className="base-stat">
            {pokeData.stats.map((poke) => {
              return (
                <>
                  <h3>
                    {poke.stat.korean_name}:{poke.base_stat}
                  </h3>
                </>
              );
            })}
          </div>
          <div className="evolutionChain">
            <h1>진화단계</h1>
            <div className="evolution-box">
              {species1 && <div>{species1.names[2].name}</div>}
              {species2 && <div>{species2.names[2].name}</div>}
              {species3 && <div>{species3.names[2].name}</div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default PokeInfo;
