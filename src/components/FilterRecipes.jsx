import React from 'react';
import PropTypes from 'prop-types';

function FilterRecipes({ onClick }) {
  return (
    <header>
      <button
        data-testid="filter-by-all-btn"
        onClick={ onClick }
        name=""
      >
        All
      </button>
      <button
        data-testid="filter-by-food-btn"
        onClick={ onClick }
        name="comida"
      >
        Food
      </button>
      <button
        data-testid="filter-by-drink-btn"
        onClick={ onClick }
        name="bebida"
      >
        Drinks
      </button>
    </header>
  );
}

FilterRecipes.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default FilterRecipes;
