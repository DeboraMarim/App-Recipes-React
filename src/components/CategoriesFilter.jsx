import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import CategoriesContext from '../context/CategoriesContext';
import SearchContext from '../context/SearchContext';

export default function CategoriesFilter() {
  const history = useHistory();
  const { location: { pathname } } = history;
  const { categories } = useContext(CategoriesContext);
  const { handleSearch } = useContext(SearchContext);
  const [category, setCategory] = useState('');
  const maxCategories = 5;

  const handleSelectCategory = ({ target: { name } }) => {
    if (category === name) {
      handleSearch({
        searchInput: '',
        searchRadio: 'name',
        path: pathname,
      });
    } else {
      handleSearch({ searchInput: name, searchRadio: 'category', path: pathname });
      setCategory(name);
    }
  };

  return (
    <div>
      {
        categories.length > 0 && (
          <button
            type="button"
            data-testid="All-category-filter"
            onClick={
              () => handleSearch({
                searchInput: '',
                searchRadio: 'name',
                path: pathname,
              })
            }
          >
            All
          </button>
        )
      }
      {
        categories.slice(0, maxCategories).map((c, i) => (
          <button
            type="button"
            key={ `${c.strCategory}-${i}` }
            name={ c.strCategory }
            data-testid={ `${c.strCategory}-category-filter` }
            onClick={ handleSelectCategory }
          >
            {c.strCategory}
          </button>
        ))
      }
    </div>
  );
}
