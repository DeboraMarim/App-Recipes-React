import PropTypes from 'prop-types';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import fetchData from '../helpers/fetchData';
import RecipesContext from './RecipesContext';
import SearchContext from './SearchContext';

function SearchProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const { setRecipes, setRecipeDetails } = useContext(RecipesContext);
  const history = useHistory();

  const selectApi = ({ searchInput, searchRadio, path }) => {
    switch (searchRadio.toLowerCase()) {
    case 'ingredient':
      return `https://www.${path === '/meals' ? 'themealdb' : 'thecocktaildb'}.com/api/json/v1/1/filter.php?i=${searchInput}`;
    case 'name':
      return `https://www.${path === '/meals' ? 'themealdb' : 'thecocktaildb'}.com/api/json/v1/1/search.php?s=${searchInput}`;
    case 'category':
      return `https://www.${path === '/meals' ? 'themealdb' : 'thecocktaildb'}.com/api/json/v1/1/filter.php?c=${searchInput}`;
    case 'first-letter':
      return `https://www.${path === '/meals' ? 'themealdb' : 'thecocktaildb'}.com/api/json/v1/1/search.php?f=${searchInput}`;
    case 'recommendation':
      return `https://www.the${path === '/meals' ? 'cocktail' : 'meal'}db.com/api/json/v1/1/search.php?s=`;
    default:
      return `https://www.${path === '/meals' ? 'themealdb' : 'thecocktaildb'}.com/api/json/v1/1/lookup.php?i=${searchInput}`;
    }
  };

  const handleSearch = useCallback(async (params) => {
    const { path, searchRadio } = params;
    const data = await fetchData(selectApi(params));
    if (data.length === 0) {
      global.alert('Sorry, we haven\'t found any recipes for these filters.');
      return;
    }
    if (searchRadio.toLowerCase() === 'lookup') {
      setRecipeDetails(data[0] ?? {});
    } else if (searchRadio.toLowerCase() === 'recommendation') {
      return data;
    } else {
      setRecipes(data ?? []);
      if (data.length === 1 && searchRadio.toLowerCase() !== 'category') {
        history.push(`${path}/${data[0].idMeal || data[0].idDrink}`);
      }
    }
  }, [setRecipes, setRecipeDetails, history]);

  const contextValue = useMemo(() => ({
    visible, setVisible, handleSearch,
  }), [visible, handleSearch]);

  return (
    <SearchContext.Provider value={ contextValue }>
      { children }
    </SearchContext.Provider>
  );
}

SearchProvider.propTypes = {
  children: PropTypes.shape().isRequired,
};

export default SearchProvider;
