import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { renderWithRouter } from './helpers/renderWith';
import oneDrink from '../../cypress/mocks/oneDrink';
import oneMeal from './helpers/mocks/oneMeal';
import meals from '../../cypress/mocks/meals';
import drinks from '../../cypress/mocks/drinks';

const VALID_EMAIL = 'email@teste.com';
const BTN_FAVORITE_TESTID = 'favorite-btn';
const TITLE_TESTID = 'recipe-title';
const CATEGORY_TESTID = 'recipe-category';
const BLACKHEART_TESTID = 'blackHeartIcon.svg';
const WHITEHEART_TESTID = 'whiteHeartIcon.svg';
const MEALS_PATH = '/meals/52771/in-progress';

Object.assign(navigator, {
  clipboard: {
    writeText: () => {},
  },
});

describe('Testa a Tela Detalhes da Receita', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify({ email: VALID_EMAIL }));
    jest.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url.includes('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=')) {
        return Promise.resolve({
          json: () => oneDrink,
        });
      }
      if (url.includes('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=')) {
        return Promise.resolve({
          json: () => drinks,
        });
      }
      if (url.includes('https://www.themealdb.com/api/json/v1/1/search.php?s=')) {
        return Promise.resolve({
          json: () => meals,
        });
      }
      if (url.includes('https://www.themealdb.com/api/json/v1/1/lookup.php?i=')) {
        return Promise.resolve({
          json: () => oneMeal,
        });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Testa se os componentes são exibidos adequadamente na tela de Drinks', async () => {
    renderWithRouter(<App />, { initialEntries: ['/drinks/178319/in-progress'] });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const drinkTitle = screen.getByTestId(TITLE_TESTID);
      expect(drinkTitle).toHaveTextContent(/Aquamarine/i);
    });

    screen.getByTestId('share-btn');
    expect(screen.getByTestId(BTN_FAVORITE_TESTID).src).toContain(WHITEHEART_TESTID);
    screen.getByTestId(CATEGORY_TESTID);
    screen.getByTestId(/instructions/i);
    screen.getByTestId(/recipe-photo/i);
  });

  test('Testa se os componentes são exibidos adequadamente na tela de Comidas', async () => {
    localStorage.setItem('favoriteRecipes', JSON.stringify([
      {
        id: '52771',
        type: 'meal',
        area: 'Italian',
        category: 'Vegetarian',
        alcoholicOrNot: '',
        name: oneMeal.meals[0].strMeal,
      },
    ]));

    renderWithRouter(<App />, { initialEntries: [MEALS_PATH] });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const drinkTitle = screen.getByTestId(TITLE_TESTID);
      expect(drinkTitle).toHaveTextContent(/Spicy Arrabiata Penne/i);
    });

    screen.getByTestId('share-btn');
    expect(screen.getByTestId(BTN_FAVORITE_TESTID).src).toContain(BLACKHEART_TESTID);
    screen.getByTestId(CATEGORY_TESTID);
    screen.getByTestId(/instructions/i);
    screen.getByTestId(/recipe-photo/i);
  });

  test('Testa botão de favoritar e compartilhar', async () => {
    const favoriteRecipes = [
      {
        id: '52771',
        type: 'meal',
        area: 'Italian',
        category: 'Vegetarian',
        alcoholicOrNot: '',
        name: oneMeal.meals[0].strMeal,
      },
    ];

    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));

    renderWithRouter(<App />, { initialEntries: [MEALS_PATH] });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const drinkTitle = screen.getByTestId(TITLE_TESTID);
      expect(drinkTitle).toHaveTextContent(/Spicy Arrabiata Penne/i);
    });

    const shareBtn = screen.getByTestId('share-btn');
    const favoriteBtn = screen.getByTestId(BTN_FAVORITE_TESTID);
    expect(favoriteBtn.src).toContain(BLACKHEART_TESTID);
    userEvent.click(favoriteBtn);
    expect(favoriteBtn.src).toContain(WHITEHEART_TESTID);
    userEvent.click(favoriteBtn);
    expect(favoriteBtn.src).toContain(BLACKHEART_TESTID);

    jest.spyOn(navigator.clipboard, 'writeText');

    userEvent.click(shareBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://localhost:3000/meals/52771');
    await waitFor(() => {
      expect(screen.queryAllByText(/Link copied!/i)).toHaveLength(1);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const drinkTitle = screen.getByTestId(TITLE_TESTID);
      expect(drinkTitle).toHaveTextContent(/Spicy Arrabiata Penne/i);
    });

    userEvent.click(screen.getByTestId('favorite-btn'));
  });

  test('Testa checkbox de ingredientes', async () => {
    const ceckedIngredients = [1, 2, 3, 4, 5, 6, 7, 8];

    localStorage.setItem('ceckedIngredients', JSON.stringify(ceckedIngredients));

    renderWithRouter(<App />, { initialEntries: [MEALS_PATH] });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const drinkTitle = screen.getByTestId(TITLE_TESTID);
      expect(drinkTitle).toHaveTextContent(/Spicy Arrabiata Penne/i);
    });

    const checkbox = screen.getByLabelText('penne rigate');
    expect(checkbox).toBeInTheDocument();
  });

  test('Testa receita feita', async () => {
    localStorage.setItem('doneRecipes', JSON.stringify([
      {
        id: '52771',
        type: 'meal',
        area: 'Italian',
        category: 'Vegetarian',
        alcoholicOrNot: '',
        name: oneMeal.meals[0].strMeal,
        image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg',
        doneDate: '23/06/2020',
      },
    ]));

    renderWithRouter(<App />, { initialEntries: [MEALS_PATH] });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const drinkTitle = screen.getByTestId(TITLE_TESTID);
      expect(drinkTitle).toHaveTextContent(/Spicy Arrabiata Penne/i);
    });
  });
});
