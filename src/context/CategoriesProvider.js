import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';
import fetchData from '../helpers/fetchData';
import CategoriesContext from './CategoriesContext';

function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);

  const selectApi = (path) => `https://www.${path === '/meals' ? 'themealdb' : 'thecocktaildb'}.com/api/json/v1/1/list.php?c=list`;

  const getCategories = useCallback(async (params) => {
    const data = await fetchData(selectApi(params));
    setCategories(data ?? []);
  }, [setCategories]);

  const contextValue = useMemo(() => ({
    categories, getCategories,
  }), [categories, getCategories]);

  return (
    <CategoriesContext.Provider value={ contextValue }>
      { children }
    </CategoriesContext.Provider>
  );
}

CategoriesProvider.propTypes = {
  children: PropTypes.shape().isRequired,
};

export default CategoriesProvider;
