import PropTypes from 'prop-types';
import { useMemo, useCallback, useEffect, useState } from 'react';
import copy from 'clipboard-copy';
import { toast } from 'react-toastify';
import DoneRecipesContext from './DoneRecipesContext';

function DoneRecipesProvider({ children }) {
  const [completedRecipes, setCompletedRecipes] = useState([]);

  useEffect(() => {
    const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes')) || [];
    setCompletedRecipes(doneRecipes);
  }, []);

  const shareRecipe = useCallback((id, type) => {
    copy(`http://localhost:3000/${type}s/${id}`);
    toast.success('Link copied!');
  }, []);

  const handleFilterFoods = useCallback(() => {
    const compRecipe = JSON.parse(localStorage.getItem('doneRecipes')) || [];
    const filtered = compRecipe.filter((recip) => recip.type === 'meal');
    setCompletedRecipes(filtered);
  }, []);

  const handleFilterDrinks = useCallback(() => {
    const compRecipe = JSON.parse(localStorage.getItem('doneRecipes')) || [];
    const filtered = compRecipe.filter((recip) => recip.type === 'drink');
    setCompletedRecipes(filtered);
  }, []);

  const handleClearFilters = useCallback(() => {
    const compRecipe = JSON.parse(localStorage.getItem('doneRecipes')) || [];
    setCompletedRecipes(compRecipe);
  }, []);

  const contextValue = useMemo(() => ({
    completedRecipes,
    shareRecipe,
    handleFilterDrinks,
    handleFilterFoods,
    handleClearFilters,
  }), [completedRecipes,
    shareRecipe,
    handleClearFilters,
    handleFilterDrinks,
    handleFilterFoods]);

  return (
    <DoneRecipesContext.Provider value={ contextValue }>
      { children }
    </DoneRecipesContext.Provider>
  );
}

DoneRecipesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DoneRecipesProvider;
