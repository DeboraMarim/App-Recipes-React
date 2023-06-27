import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { renderWithRouter } from './helpers/renderWith';

const VALID_EMAIL = 'email@teste.com';
const SEARCH_INPUT_TESTID = 'search-input';
const PROFILE_BTN_TESTID = 'profile-top-btn';
const SEARCH_BTN_TESTID = 'search-top-btn';

describe('Testa o componente Header', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify({ email: VALID_EMAIL }));
  });

  test('Testa se os componentes do Header são exibidos adequadamente na tela de Drinks', async () => {
    renderWithRouter(<App />, { initialEntries: ['/drinks'] });

    expect(screen.getByRole('heading', { name: 'Drinks' })).toBeInTheDocument();

    expect(screen.queryByTestId(SEARCH_INPUT_TESTID)).not.toBeInTheDocument();
    expect(screen.getByTestId(PROFILE_BTN_TESTID)).toBeInTheDocument();
    expect(screen.getByTestId(SEARCH_BTN_TESTID)).toBeInTheDocument();

    const searchBtn = screen.getByTestId(SEARCH_BTN_TESTID);
    userEvent.click(searchBtn);
    expect(screen.queryByTestId(SEARCH_INPUT_TESTID)).toBeInTheDocument();
    userEvent.click(searchBtn);
    expect(screen.queryByTestId(SEARCH_INPUT_TESTID)).not.toBeInTheDocument();
  });

  test('Testa se os componentes do Header são exibidos adequadamente na tela de Meals', async () => {
    renderWithRouter(<App />, { initialEntries: ['/meals'] });

    expect(screen.getByRole('heading', { name: 'Meals' })).toBeInTheDocument();

    expect(screen.queryByTestId(SEARCH_INPUT_TESTID)).not.toBeInTheDocument();
    expect(screen.getByTestId(PROFILE_BTN_TESTID)).toBeInTheDocument();
    expect(screen.getByTestId(SEARCH_BTN_TESTID)).toBeInTheDocument();

    const searchBtn = screen.getByTestId(SEARCH_BTN_TESTID);
    userEvent.click(searchBtn);
    expect(screen.queryByTestId(SEARCH_INPUT_TESTID)).toBeInTheDocument();
    userEvent.click(searchBtn);
    expect(screen.queryByTestId(SEARCH_INPUT_TESTID)).not.toBeInTheDocument();
  });

  test('Testa se os componentes do Header são exibidos adequadamente na tela de Profile', async () => {
    renderWithRouter(<App />, { initialEntries: ['/profile'] });

    expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();

    expect(screen.queryByTestId(SEARCH_INPUT_TESTID)).not.toBeInTheDocument();
    expect(screen.queryByTestId(PROFILE_BTN_TESTID)).toBeInTheDocument();
    expect(screen.queryByTestId(SEARCH_BTN_TESTID)).not.toBeInTheDocument();
  });

  test('Testa se os componentes do Header são exibidos adequadamente na tela de Done Recipes', async () => {
    renderWithRouter(<App />, { initialEntries: ['/done-recipes'] });

    expect(screen.getByRole('heading', { name: 'Done Recipes' })).toBeInTheDocument();

    expect(screen.queryByTestId(SEARCH_INPUT_TESTID)).not.toBeInTheDocument();
    expect(screen.queryByTestId(PROFILE_BTN_TESTID)).toBeInTheDocument();
    expect(screen.queryByTestId(SEARCH_BTN_TESTID)).not.toBeInTheDocument();
  });

  test('Testa se os componentes do Header são exibidos adequadamente na tela de Favorite Recipes', async () => {
    renderWithRouter(<App />, { initialEntries: ['/favorite-recipes'] });

    expect(screen.getByRole('heading', { name: 'Favorite Recipes' })).toBeInTheDocument();

    expect(screen.queryByTestId(SEARCH_INPUT_TESTID)).not.toBeInTheDocument();
    expect(screen.queryByTestId(PROFILE_BTN_TESTID)).toBeInTheDocument();
    expect(screen.queryByTestId(SEARCH_BTN_TESTID)).not.toBeInTheDocument();
  });

  test('Testa se o botão Profile redireciona a pessoa usuária corretamente', async () => {
    const { history } = renderWithRouter(<App />, { initialEntries: ['/meals'] });

    const profileBtn = screen.getByTestId(PROFILE_BTN_TESTID);
    userEvent.click(profileBtn);

    expect(history.location.pathname).toBe('/profile');
  });
});
