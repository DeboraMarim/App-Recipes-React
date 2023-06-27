import React from 'react';
import { useHistory } from 'react-router-dom';
import drinkIcon from '../images/drinkIcon.svg';
import mealIcon from '../images/mealIcon.svg';
import './css/Footer.css';

export default function Footer() {
  const history = useHistory();

  return (
    <div className="footer" data-testid="footer">
      <button type="button" onClick={ () => history.push('/drinks') }>
        <img data-testid="drinks-bottom-btn" src={ drinkIcon } alt="Link to Drinks" />
      </button>
      <button type="button" onClick={ () => history.push('/meals') }>
        <img data-testid="meals-bottom-btn" src={ mealIcon } alt="Link to Meals" />
      </button>
    </div>
  );
}
