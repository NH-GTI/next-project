'use client';

import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchInputProps> = ({ value, onChange }) => {
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Recherche par référence"
      value={value}
      onChange={handleSearch}
    />
  );
};

export default SearchBar;
