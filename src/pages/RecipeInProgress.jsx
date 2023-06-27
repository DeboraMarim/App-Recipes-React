import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import copy from 'clipboard-copy';
import RecipesContext from '../context/RecipesContext';
import SearchContext from '../context/SearchContext';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';

export default function RecipeInProgress() {
  const { recipeDetails } = useContext(RecipesContext);
  const { handleSearch } = useContext(SearchContext);
  const history = useHistory();
  const { pathname } = history.location;
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [details, setDetails] = useState({
    id: '',
    image: '',
    name: '',
    category: '',
    ingredients: [],
    instructions: '',
    nationality: '',
    alcoholicOrNot: '',
    tags: [],
    type: '',
    doneDate: '',
  });
  const [favoritesRecipes, setFavoritesRecipes] = useState(
    JSON.parse(localStorage.getItem('favoriteRecipes')) || [],
  );
  const [isRecipeFavorite, setIsRecipeFavorite] = useState(
    (JSON.parse(localStorage.getItem('favoriteRecipes')) || [])
      .some((r) => r.id === pathname.split('/')[2].toLowerCase()),
  );

  useEffect(() => {
    const id = pathname.split('/')[2];
    const path = `/${pathname.split('/')[1]}`;
    handleSearch({
      searchRadio: 'lookup',
      path,
      searchInput: id,
    });
  }, [handleSearch, pathname]);

  useEffect(() => {
    const ingredients = [];
    const keys = Object.keys(recipeDetails);
    const ingredientsKeys = keys.filter((key) => key.includes('strIngredient'));
    ingredientsKeys.forEach((key) => {
      if (recipeDetails[key]) {
        ingredients.push(recipeDetails[key]);
      }
    });
    const tags = [];
    const tagsKey = keys.filter((key) => key.includes('strTags'));
    tagsKey.forEach((key) => {
      if (recipeDetails[key] !== null) {
        const tagsString = recipeDetails[key];
        const separatedTags = tagsString.split(',');
        tags.push(...separatedTags);
      }
    });

    const dateNow = new Date();
    setDetails({
      id: (recipeDetails.idMeal || recipeDetails.idDrink) ?? '',
      image: recipeDetails.strMealThumb || recipeDetails.strDrinkThumb,
      name: recipeDetails.strMeal || recipeDetails.strDrink,
      category: recipeDetails.strCategory,
      ingredients,
      instructions: recipeDetails.strInstructions,
      nationality: (recipeDetails.strArea) ? recipeDetails.strArea : '',
      alcoholicOrNot: (recipeDetails.strAlcoholic) ? recipeDetails.strAlcoholic : '',
      tags,
      type: (recipeDetails.strMeal) ? 'meal' : 'drink',
      doneDate: dateNow,
    });
  }, [recipeDetails]);

  useEffect(() => {
    const ceckedIngredients = JSON.parse(localStorage.getItem('ceckedIngredients'));
    if (ceckedIngredients) {
      setCheckedIngredients(ceckedIngredients);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ceckedIngredients', JSON.stringify(checkedIngredients));
  }, [checkedIngredients]);

  const handleCheckboxChange = ({ target }, index) => {
    const isChecked = target.checked;
    if (isChecked) {
      setCheckedIngredients([...checkedIngredients, index]);
    } else {
      setCheckedIngredients(checkedIngredients.filter((i) => i !== index));
    }
  };

  const handleShare = () => {
    const URL = `${window.location.origin}:3000${pathname.replace('/in-progress', '')}`;
    setIsCopied(true);
    copy(URL);
    console.log(URL);
  };

  const handleFavoriteBtn = () => {
    const lessOne = -1;
    if (isRecipeFavorite) {
      const newFavoriteRecipes = favoritesRecipes
        .filter((r) => (
          r.id !== details.id
        ));
      localStorage.setItem('favoriteRecipes', JSON.stringify(newFavoriteRecipes));
      setFavoritesRecipes(newFavoriteRecipes);
      setIsRecipeFavorite(false);
    } else {
      const newFavoriteRecipe = {
        id: details.id,
        nationality: details.nationality ?? '',
        name: details.name,
        category: details.category,
        image: details.image,
        alcoholicOrNot: details.alcoholicOrNot ?? '',
        type: pathname.split('/')[1].slice(0, lessOne),
      };
      localStorage.setItem('favoriteRecipes', JSON.stringify([
        ...favoritesRecipes,
        newFavoriteRecipe,
      ]));
      setFavoritesRecipes([...favoritesRecipes, newFavoriteRecipe]);
      setIsRecipeFavorite(true);
    }
  };

  const handleFinishClick = (recipe) => {
    const finishedRecipes = JSON.parse(localStorage.getItem('doneRecipes')) || [];

    delete recipe.ingredients;
    delete recipe.instructions;
    if (!finishedRecipes.includes(recipe)) {
      const updatedFinishedRecipes = [...finishedRecipes, recipe];
      localStorage.setItem('doneRecipes', JSON.stringify(updatedFinishedRecipes));
      history.push('/done-recipes');
    }
  };

  useEffect(() => {
    if (checkedIngredients.length === details.ingredients.length) {
      setIsFinished(true);
    } else {
      setIsFinished(false);
    }
  }, [checkedIngredients, details.ingredients]);

  return (
    <div>
      <header>
        <button
          type="button"
          data-testid="share-btn"
          onClick={ handleShare }
        >
          {isCopied ? 'Link copied!' : 'Share'}

        </button>
        <button
          type="button"
          onClick={ handleFavoriteBtn }
          value={ details.id }
        >
          <img
            data-testid="favorite-btn"
            src={ isRecipeFavorite ? blackHeartIcon : whiteHeartIcon }
            alt="Favorite"
          />
        </button>
        <p data-testid="recipe-category">
          { details.category }
        </p>
        <img
          data-testid="recipe-photo"
          src={ details.image }
          alt={ details.name }
        />
        <h1 data-testid="recipe-title">{ details.name }</h1>
      </header>

      {details.ingredients.map((ingredient, index) => (
        <label
          key={ `${details.id}-${index}` }
          id="checkbox"
          data-testid={ `${index}-ingredient-step` }
          style={ { textDecoration: (
            checkedIngredients.includes(index)
              ? 'line-through solid rgb(0, 0, 0)' : 'none') } }
        >
          <input
            type="checkbox"
            // mudar index para ingredient
            checked={ checkedIngredients.includes(index) }
            onChange={ (event) => handleCheckboxChange(event, index) }
          />
          {ingredient}
        </label>
      ))}

      <section>
        <h4>Instructions</h4>
        <p data-testid="instructions">{ details.instructions }</p>
      </section>
      <footer>
        <button
          type="button"
          data-testid="finish-recipe-btn"
          disabled={ !isFinished }
          onClick={ () => handleFinishClick(details) }
        >
          FINISH RECIPE

        </button>
      </footer>
    </div>
  );
}
