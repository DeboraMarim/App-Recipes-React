import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clipboardCopy from 'clipboard-copy';
import { Link, useHistory } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import './css/RecipeCard.css';

function FavoriteCard(props) {
  const [isLinkCopied, setIsLinkCopied] = React.useState(false);
  const history = useHistory().location.pathname;
  const {
    recipe,
    index,
    removeFavorite,
    isFavorite,
    setIsFavorite,
  } = props;

  useEffect(() => {
    if (history === '/favorite-recipes') {
      setIsFavorite(true);
    }
  }, [history, setIsFavorite]);

  return (
    <>
      <div>
        <Link
          key={ index }
          to={ `/${recipe.type}s/${recipe.id}` }
          styles={ { textDecoration: 'none' } }
        >
          <img
            src={ recipe.image }
            alt={ recipe.name }
            data-testid={ `${index}-horizontal-image` }
            className="recipe-card-image"
          />
          <h2 data-testid={ `${index}-horizontal-name` }>{recipe.name}</h2>
        </Link>
        <h3 data-testid={ `${index}-horizontal-top-text` }>
          {recipe.type === 'meal'
            ? `${recipe.nationality} - ${recipe.category}` : recipe.alcoholicOrNot}
        </h3>

        <h3 data-testid={ `${index}-horizontal-done-date` }>
          {recipe.doneDate}
        </h3>

        {recipe.tags && recipe.tags.map((tag, indexTag) => (
          <span
            key={ indexTag }
            data-testid={ `${index}-${tag}-horizontal-tag` }
          >
            {tag}
          </span>
        ))}
      </div>

      <div>

        <button
          type="button"
          data-testid={ `${index}-horizontal-share-btn` }
          src={ shareIcon }
          onClick={ () => {
            clipboardCopy(`http://localhost:3000/${recipe.type}s/${recipe.id}`);
            setIsLinkCopied(true);
          } }
        >
          <img
            src={ shareIcon }
            alt="share"
          />
          {isLinkCopied && <span>Link copied!</span>}
        </button>

        <button
          type="button"
          data-testid={ `${index}-horizontal-favorite-btn` }
          src={ isFavorite ? blackHeartIcon : whiteHeartIcon }
          onClick={ () => {
            if (isFavorite) {
              removeFavorite(recipe);
            }
          } }
        >
          <img
            alt="favorite"
            src={ isFavorite ? blackHeartIcon : whiteHeartIcon }
          />
        </button>
      </div>
    </>
  );
}

FavoriteCard.propTypes = {
  recipe: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    nationality: PropTypes.string,
    category: PropTypes.string,
    alcoholicOrNot: PropTypes.string,
    doneDate: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    id: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  removeFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  setIsFavorite: PropTypes.func.isRequired,
};

export default FavoriteCard;
