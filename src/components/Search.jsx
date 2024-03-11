const Search = ({ searchName }) => {
  return (
    <>
      <div className="search__container">
        <input
          type="text"
          className="search-input"
          placeholder="검색어를 입력하세요"
          onChange={(e) => searchName(e.target.value)}
        />
      </div>
    </>
  );
};

export default Search;
