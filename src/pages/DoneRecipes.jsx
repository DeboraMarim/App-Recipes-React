import React, { useContext } from 'react';
import './css/DoneRecipes.css';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import shareIcon from '../images/shareIcon.svg';
import DoneRecipesContext from '../context/DoneRecipesContext';

function DoneRecipes() {
  const { completedRecipes,
    shareRecipe,
    handleClearFilters,
    handleFilterDrinks,
    handleFilterFoods,
  } = useContext(DoneRecipesContext);
  return (
    <>
      <Header title="Done Recipes" showSearch={ false } />
      <div>
        <div className="btns">
          <button
            type="button"
            data-testid="filter-by-all-btn"
            onClick={ handleClearFilters }
          >
            All
          </button>
          <button
            type="button"
            data-testid="filter-by-meal-btn"
            onClick={ handleFilterFoods }
          >
            Food
          </button>
          <button
            type="button"
            data-testid="filter-by-drink-btn"
            onClick={ handleFilterDrinks }
          >
            Drinks
          </button>
        </div>
        {completedRecipes.map((recipes, index) => (
          <div key={ index } className="recipesCard">
            <Link to={ `/${recipes.type}s/${recipes.id}` }>
              <div className="image">
                <img
                  className="recipePhoto"
                  src={ recipes.image }
                  alt="recipes"
                  data-testid={ `${index}-horizontal-image` }
                />
              </div>
            </Link>
            <div>
              <Link to={ `/${recipes.type}s/${recipes.id}` } className="name">
                <h5
                  data-testid={ `${index}-horizontal-name` }
                >
                  { recipes.name }
                </h5>
              </Link>
              <div
                className="badge"
                data-testid={ `${index}-horizontal-top-text` }
              >
                { recipes.nationality && `${recipes.nationality} - ${recipes.category}`}
                {!recipes.nationality && `${recipes.category}`}
              </div>
              {' '}
              {recipes.tags.map((tag) => (
                <>
                  <span
                    className="badge"
                    key={ `${tag}-${index}` }
                    data-testid={ `${index}-${tag}-horizontal-tag` }
                  >
                    {tag}
                  </span>
                  <span>
                    {' '}
                  </span>
                </>
              ))}

              <span
                className="badge rounded-pill bg-warning text-dark"
                style={ { display: recipes.type === 'meal' ? null : false } }
                data-testid={ `${index}-horizontal-top-text` }
              >
                { recipes.alcoholicOrNot}
              </span>
              <div
                data-testid={ `${index}-horizontal-done-date` }
              >
                Done in:
                {' '}
                { recipes.doneDate }
              </div>
            </div>
            <button
              className="btn"
              data-testid={ `${index}-horizontal-share-btn` }
              type="button"
              onClick={ () => shareRecipe(recipes.id, recipes.type) }
              src={ shareIcon }
            >
              <img src={ shareIcon } alt="heart icon" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
export default DoneRecipes;
