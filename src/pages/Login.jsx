import React, { useContext, useEffect, useState } from 'react';
import LoginContext from '../context/LoginContext';
import appLogo from '../images/appLogo.png';
import bigTomatos from '../images/bigTomatos.png';
import './css/Login.css';

export default function Login() {
  const { handleClick } = useContext(LoginContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabled, setDisabled] = useState(true);

  useEffect(() => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const minLength = 6;
    const emailValid = emailRegex.test(email);
    const passwordLength = password.length > minLength;
    if (emailValid && passwordLength) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [email, password]);

  return (
    <div className="loginPage">
      <img className="loginLogo" src={ appLogo } alt="App Logo" />
      <div className="purpleContainer">
        <img className="bigTomatos" src={ bigTomatos } alt="Big Tomatos" />
      </div>
      <div className="loginInputs">
        <h1 className="loginTitle">Login</h1>
        <input
          type="email"
          name="email"
          id="email-login"
          data-testid="email-input"
          value={ email }
          placeholder="Email"
          onChange={ ({ target: { value } }) => {
            setEmail(value);
          } }
        />
        <input
          type="password"
          name="password"
          id="password-login"
          data-testid="password-input"
          value={ password }
          placeholder="Password"
          onChange={ ({ target: { value } }) => {
            setPassword(value);
          } }
        />
        <button
          type="button"
          data-testid="login-submit-btn"
          disabled={ isDisabled }
          onClick={ () => handleClick({ email, password }) }
        >
          Enter
        </button>
      </div>
    </div>
  );
}
