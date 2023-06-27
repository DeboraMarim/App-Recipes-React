import PropTypes from 'prop-types';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import CategoriesProvider from '../context/CategoriesProvider';
import DoneRecipesProvider from '../context/DoneRecipesProvider';
import LoginProvider from '../context/LoginProvider';
import RecipesProvider from '../context/RecipesProvider';
import SearchProvider from '../context/SearchProvider';

export default function Content({ children }) {
  return (
    <LoginProvider>
      <RecipesProvider>
        <ToastContainer />
        <DoneRecipesProvider>
          <SearchProvider>
            <CategoriesProvider>
              {children}
            </CategoriesProvider>
          </SearchProvider>
        </DoneRecipesProvider>
      </RecipesProvider>
    </LoginProvider>
  );
}

Content.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
}.isRequired;
