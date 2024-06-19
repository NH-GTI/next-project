'use client';

import React from 'react';

interface SearchInputProps {
  searchTermDes: string;
  searchTermRef: string;
  searchTermGencod: string;
  onChange: (value: string, searchType: string) => void;
}

const SearchBar: React.FC<SearchInputProps> = ({
  searchTermDes,
  searchTermRef,
  searchTermGencod,
  onChange,
}) => {
  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement>,
    searchType: string,
  ) => {
    onChange(event.target.value, searchType);
  };

  return (
    <>
      <input
        className="mr-5 mt-5"
        type="text"
        placeholder="Recherche par désignation"
        value={searchTermDes}
        onChange={(e) => handleSearch(e, 'des')}
      />
      <input
        className="mr-5"
        type="text"
        placeholder="Recherche par référence"
        value={searchTermRef}
        onChange={(e) => handleSearch(e, 'ref')}
      />
      <input
        type="text"
        placeholder="Recherche par GENCOD"
        value={searchTermGencod}
        onChange={(e) => handleSearch(e, 'gencod')}
      />
    </>
  );
};

export default SearchBar;
