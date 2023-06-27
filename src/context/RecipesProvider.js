import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import RecipesContext from './RecipesContext';

function RecipesProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const [recipeDetails, setRecipeDetails] = useState({});

  const contextValue = useMemo(() => ({
    recipes, setRecipes, recipeDetails, setRecipeDetails,
  }), [recipes, recipeDetails]);

  return (
    <RecipesContext.Provider value={ contextValue }>
      { children }
    </RecipesContext.Provider>
  );
}

RecipesProvider.propTypes = {
  children: PropTypes.shape().isRequired,
};

export default RecipesProvider;
