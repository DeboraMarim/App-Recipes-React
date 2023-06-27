import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { renderWithRouter } from './helpers/renderWith';

describe('Testa o componente Footer', () => {
  test('Testa se os componentes do Footer são exibidos adequadamente na tela', async () => {
    renderWithRouter(<App />, { initialEntries: ['/drinks'] });

    const imgLinkToDrinks = screen.getByRole('img', {
      name: /link to drinks/i,
    });
    const imgLinkToMeals = screen.getByRole('img', {
      name: /link to meals/i,
    });
    expect(imgLinkToDrinks.src.includes('/drinkIcon.svg')).toBeTruthy();
    expect(imgLinkToMeals.src.includes('/mealIcon.svg')).toBeTruthy();
    screen.getByRole('button', {
      name: /link to drinks/i,
    });
    screen.getByRole('button', {
      name: /link to meals/i,
    });
  });

  test('Testa se os botões funcionam adequadamente', async () => {
    const { history } = renderWithRouter(<App />, { initialEntries: ['/meals'] });
    const mealLink = screen.getByRole('button', {
      name: /link to meals/i,
    });
    const drinkLink = screen.getByRole('button', {
      name: /link to drinks/i,
    });

    userEvent.click(drinkLink);
    await waitFor(() => {
      expect(history.location.pathname).toBe('/drinks');
    });

    userEvent.click(mealLink);
    await waitFor(() => {
      expect(history.location.pathname).toBe('/meals');
    });
  });
});
