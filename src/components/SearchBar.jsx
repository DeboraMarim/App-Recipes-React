import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SearchContext from '../context/SearchContext';

export default function SearchBar() {
  const history = useHistory();
  const [searchInput, setSearchInput] = useState('');
  const [searchRadio, setSearchRadio] = useState('ingredient');
  const { handleSearch } = useContext(SearchContext);

  const handleClick = () => {
    if (searchRadio === 'first-letter' && searchInput.length > 1) {
      global.alert('Your search must have only 1 (one) character');
      return;
    }
    if (searchInput.length === 0) {
      global.alert('Your search must have at least 1 (one) character');
      return;
    }
    handleSearch({ searchInput, searchRadio, path: history.location.pathname });
  };

  return (
    <div>
      <div>
        <input
          type="text"
          name="searchInput"
          id="search-input"
          data-testid="search-input"
          placeholder="Search"
          value={ searchInput }
          onChange={ (e) => setSearchInput(e.target.value) }
        />
        <div />
        <label htmlFor="ingredient-search">
          <input
            type="radio"
            name="search-radio"
            id="ingredient-search"
            data-testid="ingredient-search-radio"
            value="ingredient"
            checked={ searchRadio === 'ingredient' }
            onChange={ (e) => setSearchRadio(e.target.value) }
          />
          Ingredient
        </label>
        <label htmlFor="name-search">
          <input
            type="radio"
            name="search-radio"
            id="name-search"
            data-testid="name-search-radio"
            value="name"
            checked={ searchRadio === 'name' }
            onChange={ (e) => setSearchRadio(e.target.value) }
          />
          Name
        </label>
        <label htmlFor="first-letter-search">
          <input
            type="radio"
            name="search-radio"
            id="first-letter-search"
            data-testid="first-letter-search-radio"
            value="first-letter"
            checked={ searchRadio === 'first-letter' }
            onChange={ (e) => setSearchRadio(e.target.value) }
          />
          First Letter
        </label>
        <button
          type="button"
          data-testid="exec-search-btn"
          onClick={ handleClick }
        >
          Search
        </button>
      </div>
    </div>
  );
}
