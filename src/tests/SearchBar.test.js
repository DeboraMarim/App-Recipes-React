import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import App from '../App';
import { renderWithRouter } from './helpers/renderWith';
import mealsWithChicken from './helpers/mocks/mealsWithChicken';

const VALID_EMAIL = 'email@teste.com';
const INGREDIENT_RADIO_TESTID = 'ingredient-search-radio';
const NAME_RADIO_TESTID = 'name-search-radio';
const FIRST_LETTER_RADIO_TESTID = 'first-letter-search-radio';
const OPEN_SEARCH_BTN_TESTID = 'search-top-btn';
const SEARCH_BTN_TESTID = 'exec-search-btn';
const SEARCH_INPUT_TESTID = 'search-input';

describe('Testa o componente SearchBar', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      json: () => mealsWithChicken,
    }));
    jest.spyOn(global, 'alert').mockImplementation(() => {});
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify({ email: VALID_EMAIL }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Testa os componentes da SearchBar', async () => {
    renderWithRouter(<App />, { initialEntries: ['/meals'] });
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=');
      expect(global.fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
      expect(screen.getAllByTestId(/recipe-card/i)).toHaveLength(11);
    });

    const openSearchBtn = screen.getByTestId(OPEN_SEARCH_BTN_TESTID);
    userEvent.click(openSearchBtn);

    expect(screen.getByTestId(NAME_RADIO_TESTID)).toBeInTheDocument();
    expect(screen.getByTestId(FIRST_LETTER_RADIO_TESTID)).toBeInTheDocument();
    expect(screen.getByTestId(SEARCH_INPUT_TESTID)).toBeInTheDocument();
    expect(screen.getByTestId(INGREDIENT_RADIO_TESTID)).toBeInTheDocument();
    expect(screen.getByTestId(SEARCH_BTN_TESTID)).toBeInTheDocument();
  });

  test('Testa os filtros e requisições da SearchBar', async () => {
    const { history } = renderWithRouter(<App />, { initialEntries: ['/meals'] });
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=');
      expect(global.fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
      expect(screen.getAllByTestId(/recipe-card/i)).toHaveLength(11);
    });

    const openSearchBtn = screen.getByTestId(OPEN_SEARCH_BTN_TESTID);
    userEvent.click(openSearchBtn);

    const inputSearch = screen.getByTestId(SEARCH_INPUT_TESTID);
    const ingredientRadio = screen.getByTestId(INGREDIENT_RADIO_TESTID);
    const nameRadio = screen.getByTestId(NAME_RADIO_TESTID);
    const firstLetterRadio = screen.getByTestId(FIRST_LETTER_RADIO_TESTID);
    const buttonSearch = screen.getByTestId(SEARCH_BTN_TESTID);

    userEvent.type(inputSearch, 'chicken');
    userEvent.click(ingredientRadio);
    userEvent.click(buttonSearch);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(global.fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken');
      expect(screen.getAllByTestId(/recipe-card/i)).toHaveLength(11);
    });

    userEvent.click(firstLetterRadio);
    userEvent.click(buttonSearch);
    expect(global.alert).toHaveBeenCalledTimes(1);

    userEvent.clear(inputSearch);
    userEvent.click(nameRadio);
    userEvent.click(buttonSearch);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    expect(global.alert).toHaveBeenCalledTimes(2);
    userEvent.click(ingredientRadio);

    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      json: () => (
        {
          meals: Object.values(mealsWithChicken)[0]
            .filter((meal) => meal.strMeal[0].toLowerCase() === 'c'),
        }
      ),
    }));

    userEvent.clear(inputSearch);
    userEvent.type(inputSearch, 'c');
    userEvent.click(firstLetterRadio);
    userEvent.click(buttonSearch);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(4);
      expect(global.fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?f=c');
      expect(screen.getAllByTestId(/recipe-card/i)).toHaveLength(5);
    });

    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      json: () => ({
        meals: Object.values(mealsWithChicken)[0]
          .filter((meal) => meal.strMeal === 'Chicken Alfredo Primavera'),
      }),
    }));

    userEvent.clear(inputSearch);
    userEvent.type(inputSearch, 'Chicken Alfredo Primavera');
    userEvent.click(nameRadio);
    userEvent.click(buttonSearch);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(7);
      expect(global.fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=Chicken Alfredo Primavera');
      expect(history.location.pathname).toBe('/meals/52796');
    });

    act(() => {
      history.push('/meals');
    });

    await waitFor(() => {
      expect(history.location.pathname).toBe('/meals');
      expect(screen.getByTestId(SEARCH_INPUT_TESTID)).toBeInTheDocument();
    });

    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      json: () => ({
        meals: [],
      }),
    }));

    userEvent.clear(screen.getByTestId(SEARCH_INPUT_TESTID));
    userEvent.type(screen.getByTestId(SEARCH_INPUT_TESTID), 'NAOEXISTE');
    userEvent.click(screen.getByTestId(NAME_RADIO_TESTID));
    userEvent.click(screen.getByTestId(SEARCH_BTN_TESTID));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(11);
      expect(global.fetch).toHaveBeenCalledWith('https://www.themealdb.com/api/json/v1/1/search.php?s=NAOEXISTE');
      expect(global.alert).toHaveBeenCalledTimes(4);
    });
  });
});
