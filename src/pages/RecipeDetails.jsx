import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import clipboardCopy from 'clipboard-copy';
import RecipesContext from '../context/RecipesContext';
import SearchContext from '../context/SearchContext';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import shareIcon from '../images/shareIcon.svg';
import './css/RecipeDetails.css';

export default function RecipeDetails() {
  const { handleSearch } = useContext(SearchContext);
  const { recipeDetails } = useContext(RecipesContext);
  const history = useHistory();
  const { pathname } = history.location;
  const [details, setDetails] = useState({
    id: '',
    image: '',
    title: '',
    category: '',
    ingredients: [],
    video: undefined,
    instructions: '',
    nationality: '',
    alcoholicOrNot: '',
  });
  const [recomends, setRecomends] = useState([]);
  const [favoritesRecipes, setFavoritesRecipes] = useState(
    JSON.parse(localStorage.getItem('favoriteRecipes')) || [],
  );
  const [isRecipeFavorite, setIsRecipeFavorite] = useState(
    (JSON.parse(localStorage.getItem('favoriteRecipes')) || [])
      .some((r) => r.id === pathname.split('/')[2].toLowerCase()),
  );

  const maxRecomends = 6;
  const isRecipeDone = (JSON.parse(localStorage.getItem('doneRecipes')) || [])
    .filter((r) => pathname.split('/')[1].toLowerCase().includes(r.type.toLowerCase()))
    .some((r) => r.id === pathname.split('/')[2].toLowerCase());
  const isRecipeInProgress = Object.keys((
    JSON.parse(localStorage.getItem('inProgressRecipes')) || {}
  )[pathname.split('/')[1]] ?? {})
    .includes(pathname.split('/')[2].toLowerCase());

  useEffect(() => {
    const id = pathname.split('/')[2];
    const path = `/${pathname.split('/')[1]}`;
    handleSearch({
      searchRadio: 'lookup',
      path,
      searchInput: id,
    });
  }, [handleSearch, pathname]);

  const getRecomends = useCallback(async () => {
    const path = `/${pathname.split('/')[1]}`;
    const recomendations = await handleSearch({
      searchRadio: 'recommendation',
      path,
    });
    setRecomends(recomendations);
  }, [handleSearch, pathname]);

  useEffect(() => {
    if (recomends.length === 0 && !(recipeDetails.idMeal || recipeDetails.idDrink)) {
      getRecomends();
    }
    const ingredients = [];
    const keys = Object.keys(recipeDetails);
    const ingredientsKeys = keys.filter((key) => key.includes('strIngredient'));
    ingredientsKeys.forEach((key) => {
      if (recipeDetails[key]) {
        ingredients.push(recipeDetails[key]);
      }
    });
    setDetails({
      id: (recipeDetails.idMeal || recipeDetails.idDrink) ?? '',
      image: recipeDetails.strMealThumb || recipeDetails.strDrinkThumb,
      title: recipeDetails.strMeal || recipeDetails.strDrink,
      category: recipeDetails.strCategory,
      ingredients,
      video: recipeDetails.strYoutube ? (
        recipeDetails.strYoutube.replace('watch?v=', 'embed/')
      ) : undefined,
      instructions: recipeDetails.strInstructions,
      nationality: recipeDetails.strArea,
      alcoholicOrNot: recipeDetails.strAlcoholic,
    });
  }, [recipeDetails, getRecomends, recomends]);

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
        type: pathname.split('/')[1].slice(0, lessOne),
        nationality: details.nationality ?? '',
        category: details.category,
        alcoholicOrNot: details.alcoholicOrNot ?? '',
        name: details.title,
        image: details.image,
      };
      localStorage.setItem('favoriteRecipes', JSON.stringify([
        ...favoritesRecipes,
        newFavoriteRecipe,
      ]));
      setFavoritesRecipes([...favoritesRecipes, newFavoriteRecipe]);
      setIsRecipeFavorite(true);
    }
  };

  return (
    <div className="recipeDetailsPage">
      RecipeDetails
      <button
        type="button"
        className="favoriteBtn"
        onClick={ handleFavoriteBtn }
      >
        <img
          data-testid="favorite-btn"
          src={ isRecipeFavorite ? blackHeartIcon : whiteHeartIcon }
          alt="Favorite"
        />
      </button>
      <button
        type="button"
        className="shareBtn"
        id="shareBtn"
        onClick={ () => {
          clipboardCopy(`http://localhost:3000${pathname}`);
          const shareBtn = document.querySelector('#shareBtn');
          const newText = document.createTextNode('Link copied!');
          shareBtn.appendChild(newText);
          const threeSeconds = 2000;
          setTimeout(() => {
            shareBtn.removeChild(newText);
          }, threeSeconds);
        } }
      >
        <img
          data-testid="share-btn"
          src={ shareIcon }
          alt="Share"
        />
      </button>
      <img
        src={ details.image }
        alt="Imagem da Receita"
        data-testid="recipe-photo"
        className="recipePhoto"
      />
      <h1 data-testid="recipe-title">{details.title}</h1>
      <h2 data-testid="recipe-category">
        { pathname.includes('meals')
          ? details.category : details.alcoholicOrNot }
      </h2>
      <div>
        <h3>Ingredients</h3>
        <ul>
          {details.ingredients.map((ingredient, index) => (
            <li
              key={ `${details.id}-${index}` }
              data-testid={ `${index}-ingredient-name-and-measure` }
            >
              {ingredient}
              {': '}
              {recipeDetails[`strMeasure${index + 1}`]}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Instructions</h3>
        <p data-testid="instructions">{details.instructions}</p>
      </div>
      {
        details.video && (
          <div>
            <h3>Video</h3>
            <iframe
              data-testid="video"
              title="recipe-video"
              src={ details.video }
              allowFullScreen
            />
          </div>
        )
      }
      <div className="recomendations">
        <h3>Recomendations</h3>
        <div className="carousel">
          {recomends.slice(0, maxRecomends).map((recomendation, index) => (
            <div
              key={ recomendation.idMeal || recomendation.idDrink }
              data-testid={ `${index}-recommendation-card` }
              className="carouselItem"
            >
              <img
                src={ recomendation.strMealThumb || recomendation.strDrinkThumb }
                alt={ recomendation.strMeal || recomendation.strDrink }
                className="carouselItemImg"
              />
              <h4 data-testid={ `${index}-recommendation-title` }>
                {recomendation.strMeal || recomendation.strDrink}
              </h4>
            </div>
          ))}
        </div>
      </div>
      {
        (!isRecipeDone) && (
          <button
            type="button"
            data-testid="start-recipe-btn"
            className="startRecipeBtn"
            onClick={ () => history.push(`${pathname}/in-progress`) }
          >
            {
              isRecipeInProgress ? 'Continue Recipe' : 'Start Recipe'
            }
          </button>
        )
      }
    </div>
  );
}
