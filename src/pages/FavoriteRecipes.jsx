import React, { useEffect } from 'react';
import FavoriteCard from '../components/FavoriteCard';

function FavoriteRecipes() {
  const [favoriteRecipes, setFavoriteRecipes] = React.useState([]);
  const [filteredRecipes, setFilteredRecipes] = React.useState([]);
  const [isFavorite, setIsFavorite] = React.useState(false);

  useEffect(() => {
    const storedFavoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (storedFavoriteRecipes) {
      setFavoriteRecipes(storedFavoriteRecipes);
      setFilteredRecipes(storedFavoriteRecipes);
    }
  }, []);

  const filterMeals = () => {
    const meals = favoriteRecipes.filter((recipe) => recipe.type === 'meal');
    setFilteredRecipes(meals);
  };

  const filterDrinks = () => {
    const drinks = favoriteRecipes.filter((recipe) => recipe.type === 'drink');
    setFilteredRecipes(drinks);
  };

  const filterAll = () => {
    setFilteredRecipes(favoriteRecipes);
  };

  const removeFavorite = (recipe) => {
    const storedFavoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const newFavoriteRecipes = storedFavoriteRecipes
      .filter((favoriteRecipe) => favoriteRecipe.id !== recipe.id);
    localStorage.setItem('favoriteRecipes', JSON.stringify(newFavoriteRecipes));
    setFilteredRecipes(newFavoriteRecipes);
  };

  return (
    <>
      <>
        <button
          data-testid="filter-by-all-btn"
          onClick={ filterAll }
        >

          All
        </button>
        <button
          data-testid="filter-by-meal-btn"
          onClick={ filterMeals }
        >

          Food
        </button>
        <button
          data-testid="filter-by-drink-btn"
          onClick={ filterDrinks }
        >

          Drinks
        </button>
      </>

      {filteredRecipes.map((recipe, index) => (
        <div key={ index }>
          <FavoriteCard
            recipe={ recipe }
            index={ index }
            removeFavorite={ removeFavorite }
            isFavorite={ isFavorite }
            setIsFavorite={ setIsFavorite }
          />
        </div>
      ))}
    </>
  );
}

export default FavoriteRecipes;
