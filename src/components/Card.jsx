import axios from "axios";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useRecoilState } from "recoil";
import { poketmonData, search } from "./recoil/store";

const Card = ({ pokemon }) => {
  const [pokeData, setPokeData] = useRecoilState(poketmonData);
  const [searchName, setSearchName] = useRecoilState(search);

  // 포켓몬 정보
  const getPokemonsData = async (data) => {
    data?.map(async (item) => {
      const res = await axios.get(item?.url);
      // 한글로 번역
      const species = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${res.data.id}/`
      );

      // 진화정보 저장
      var evolutionChain = null;
      if (species.data.evolution_chain.url) {
        const evolution_chain = await axios.get(
          species.data.evolution_chain.url
        );
        evolutionChain = evolution_chain.data.chain;

        if (evolutionChain.species.name === item.name) {
          evolutionChain = evolution_chain.data.chain;
        } else {
          evolutionChain.evolves_to.map((item) => {
            if (evolutionChain.species.name === item.species.name) {
              evolutionChain = evolution_chain.data.chain;
              return;
            }

            item.evolves_to.map((item) => {
              if (evolutionChain.species.name === item.species.name) {
                evolutionChain = evolution_chain.data.chain;
                return;
              }

              item.evolves_to.map((item) => {
                if (evolutionChain.species.name === item.species.name) {
                  evolutionChain = evolution_chain.data.chain;
                  return;
                }
              });
            });
          });
        }
      }

      const newName = species.data.names[2].name; // 새로운 이름을 변수에 저장

      const typeTranslate = await Promise.all(
        res.data.types.map(async (type) => {
          const typeResponse = await axios.get(type.type.url);
          const koreanTypeName = typeResponse.data.names.find(
            (name) => name.language.name === "ko"
          ).name;
          return {
            ...type,
            type: { ...type.type, korean_name: koreanTypeName },
          };
        })
      );

      const statsTranslate = await Promise.all(
        res.data.stats.map(async (stat) => {
          const statResponse = await axios.get(stat.stat.url);
          const koreanStatName = statResponse.data.names.find(
            (name) => name.language.name === "ko"
          ).name;
          return {
            ...stat,
            stat: { ...stat.stat, korean_name: koreanStatName },
          };
        })
      );

      const abilitiesTranslate = await Promise.all(
        res.data.abilities.map(async (ability) => {
          const abilityResponse = await axios.get(ability.ability.url);
          const koreanAbilityName = abilityResponse.data.names.find(
            (name) => name.language.name === "ko"
          ).name;
          return {
            ...ability,
            ability: { ...ability.ability, korean_name: koreanAbilityName },
          };
        })
      );

      res.data.koreanName = newName;
      res.data.stats = statsTranslate;
      res.data.types = typeTranslate;
      res.data.abilities = abilitiesTranslate;
      res.data.evolutionChain = evolutionChain;

      setPokeData((prev) => [...prev, res.data]);
    });
  };

  // 간헐적으로 꼬이는 순서 정렬
  const sortedPokemon = [...new Set(pokeData.map((pokemon) => pokemon.id))]
    .sort((a, b) => a - b)
    .map((id) => pokeData.find((pokemon) => pokemon.id === id));

  // 검색어가 변경될 때마다 pokeData 배열을 필터링하여 검색 결과를 업데이트
  // useMemo를 사용하여 메모리 효율 향상
  const filteredPokemons = useMemo(() => {
    if (searchName !== "" || searchName !== null) {
      return sortedPokemon?.filter((item) =>
        item.koreanName.includes(searchName)
      );
    }
  }, [sortedPokemon, searchName]);

  useEffect(() => {
    getPokemonsData(pokemon);
  }, [pokemon]);

  return (
    <>
      {filteredPokemons.map((item, index) => {
        return (
          <Link
            href={{
              pathname: `/detail/${item.name}`,
              query: { poke: JSON.stringify(item) },
            }}
            as={`/detail/${item.name}`}
            key={index}
          >
            <div
              className="card"
              key={item.id}
            >
              <h2>#{item.id}</h2>
              <img
                src={item.sprites.front_default}
                alt=""
              />
              <h2>{item.koreanName}</h2>
            </div>
          </Link>
        );
      })}
    </>
  );
};

export default Card;
