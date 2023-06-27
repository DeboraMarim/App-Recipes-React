import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import './css/RecipeCard.css';

export default function RecipeCard({ id, name, image, path }) {
  const history = useHistory();
  const handleSelect = () => {
    history.push(path);
  };

  return (
    <button
      data-testid={ `${id}-recipe-card` }
      className="recipeCard"
      onClick={ handleSelect }
    >
      <img src={ image } alt={ name } data-testid={ `${id}-card-img` } />
      <p data-testid={ `${id}-card-name` }>{name}</p>
    </button>
  );
}

RecipeCard.propTypes = {
  id: PropTypes.string,
}.isRequired;
