import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import SearchContext from '../context/SearchContext';
import profileIcon from '../images/profileIcon.svg';
import searchIcon from '../images/searchIcon.svg';
import SearchBar from './SearchBar';
import CategoriesFilter from './CategoriesFilter';
import headerLogo from '../images/headerLogo.png';
import mealIcon from '../images/mealIcon.png';
import drinkIcon from '../images/drinkIcon.png';
import './css/Header.css';

function Header({ title, showSearch = true }) {
  const history = useHistory();
  const { visible, setVisible } = useContext(SearchContext);

  const handleClickProfile = () => {
    history.push('/profile');
  };

  return (
    <div className="header">
      <div className="headerAppName">
        <img src={ headerLogo } alt="" />
        <div className="headerButtons">
          {
            showSearch && (
              <button type="button" onClick={ () => setVisible(!visible) }>
                <img
                  src={ searchIcon }
                  alt="Ícone de Busca"
                  data-testid="search-top-btn"
                />
              </button>
            )
          }
          <button type="button" onClick={ handleClickProfile }>
            <img
              src={ profileIcon }
              alt="Ícone de Perfil"
              data-testid="profile-top-btn"
            />
          </button>
        </div>
      </div>
      <div className="headerTitle">
        <img src={ title === 'Meals' ? mealIcon : drinkIcon } alt="Type of Food Icon" />
        <h1 data-testid="page-title">{title}</h1>
      </div>
      {
        visible && (
          <SearchBar />
        )
      }
      <CategoriesFilter />
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  showSearch: PropTypes.bool,
};

export default Header;
