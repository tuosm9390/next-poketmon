import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { useRecoilState, useRecoilValue } from "recoil";
import Card from "./Card";
import Search from "./Search";
import { getPoke, search } from "./recoil/store";

export default function Main() {
  const [loading, setLoading] = useState(false);
  const [nextUrl, setNextUrl] = useState(
    "https://pokeapi.co/api/v2/pokemon?limit=30"
  );
  const [searchName, setSearchName] = useRecoilState(search);
  const [ref, inView] = useInView();

  const getPokeData = useRecoilValue(getPoke(nextUrl));

  // 1번부터 순서대로 포켓몬 리스트 호출
  const getPokemons = () => {
    // 호출 성공 시 url에 다음 리스트 호출 url로 세팅
    setNextUrl(getPokeData.next);
  };

  useEffect(() => {
    if (inView) {
      setLoading(true);
      getPokemons();
      setLoading(false);
    }
  }, [inView]);

  return (
    <>
      <div className="container">
        <Search searchName={(name) => setSearchName(name)} />

        <div className="poke-grid">
          {!loading ? (
            <>
              <Card
                pokemon={getPokeData?.results}
                loading={loading}
              />
            </>
          ) : (
            <div>Loading...</div>
          )}
        </div>
        <div
          ref={ref}
          className="footer_ref"
        >
          {inView && <h3>정보를 불러오는 중입니다...</h3>}
        </div>
      </div>
    </>
  );
}
