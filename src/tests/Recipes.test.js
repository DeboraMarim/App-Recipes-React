import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import App from '../App';
import { renderWithRouter } from './helpers/renderWith';
import drinks from '../../cypress/mocks/drinks';

const VALID_EMAIL = 'email@teste.com';

describe('Testa a Tela Recipes', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify({ email: VALID_EMAIL }));
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      json: () => drinks,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Testa se os componentes são exibidos adequadamente na tela de Drinks', async () => {
    const { history } = renderWithRouter(<App />, { initialEntries: ['/drinks'] });
    expect(screen.getByRole('heading', { name: 'Drinks' })).toBeInTheDocument();
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      screen.getAllByTestId(/-category-filter/i);
      expect(screen.getAllByTestId(/-recipe-card/i)).toHaveLength(12);
    });

    act(() => {
      history.push('/meals');
    });

    await waitFor(() => {
      expect(history.location.pathname).toBe('/meals');
      expect(screen.getByRole('heading', { name: 'Meals' })).toBeInTheDocument();
      expect(screen.queryAllByTestId(/-recipe-card/i)).toHaveLength(0);
      expect(global.fetch).toHaveBeenCalledTimes(4);
    });

    await waitFor(() => {
      screen.getAllByTestId(/-category-filter/i);
      expect(screen.getAllByTestId(/-recipe-card/i)).toHaveLength(12);
    });
  });
});
