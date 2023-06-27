import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { renderWithRouter } from './helpers/renderWith';

const INVALID_EMAIL01 = ' ';
const INVALID_EMAIL02 = 'email@teste';
const VALID_EMAIL = 'email@teste.com';
const INVALID_PASSWORD = '123456';
const VALID_PASSWORD = '1234567';
const EMAIL_TESTID = 'email-input';
const PASSWORD_TESTID = 'password-input';
const BTN_LOGIN_TESTID = 'login-submit-btn';

describe('Testa a Tela de Login', () => {
  test('Testa se os componentes são exibidos na tela de login', () => {
    renderWithRouter(<App />);
    screen.getByTestId(EMAIL_TESTID);
    screen.getByTestId(PASSWORD_TESTID);
    screen.getByTestId(BTN_LOGIN_TESTID);
  });

  test('Testa se o botão Login inicia desabiltiado e se é possível digitar nos inputs', () => {
    renderWithRouter(<App />);
    const btnLogin = screen.getByTestId(BTN_LOGIN_TESTID);
    expect(btnLogin).toBeDisabled();

    const loginInput = screen.getByTestId(EMAIL_TESTID);
    const passwordInput = screen.getByTestId(PASSWORD_TESTID);

    userEvent.type(loginInput, INVALID_EMAIL01);
    userEvent.type(passwordInput, INVALID_PASSWORD);
    expect(btnLogin).toBeDisabled();

    userEvent.clear(loginInput);
    userEvent.clear(passwordInput);
    userEvent.type(loginInput, INVALID_EMAIL02);
    userEvent.type(passwordInput, INVALID_PASSWORD);
    expect(btnLogin).toBeDisabled();

    userEvent.clear(loginInput);
    userEvent.clear(passwordInput);
    userEvent.type(loginInput, VALID_EMAIL);
    userEvent.type(passwordInput, INVALID_PASSWORD);
    expect(btnLogin).toBeDisabled();

    userEvent.clear(loginInput);
    userEvent.clear(passwordInput);
    userEvent.type(loginInput, INVALID_EMAIL02);
    userEvent.type(passwordInput, VALID_PASSWORD);
    expect(btnLogin).toBeDisabled();

    userEvent.clear(loginInput);
    userEvent.clear(passwordInput);
    userEvent.type(loginInput, VALID_EMAIL);
    userEvent.type(passwordInput, VALID_PASSWORD);
    expect(btnLogin).toBeEnabled();
  });

  test('Testa se o email da pessoa usuária é salva no \'localStorage\'', () => {
    localStorage.clear();
    renderWithRouter(<App />);
    const btnLogin = screen.getByTestId(BTN_LOGIN_TESTID);
    expect(btnLogin).toBeDisabled();

    const loginInput = screen.getByTestId(EMAIL_TESTID);
    const passwordInput = screen.getByTestId(PASSWORD_TESTID);

    userEvent.type(loginInput, VALID_EMAIL);
    userEvent.type(passwordInput, VALID_PASSWORD);
    expect(btnLogin).toBeEnabled();

    userEvent.click(btnLogin);
    const emailUser = JSON.parse(localStorage.getItem('user')).email;
    expect(emailUser).toBe(VALID_EMAIL);
  });
});
