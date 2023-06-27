import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import LoginContext from './LoginContext';

function LoginProvider({ children }) {
  const history = useHistory();

  const handleClick = useCallback(({ email }) => {
    localStorage.setItem('user', JSON.stringify({ email }));
    history.push('/meals');
  }, [history]);

  const contextValue = useMemo(() => ({
    handleClick,
  }), [handleClick]);

  return (
    <LoginContext.Provider value={ contextValue }>
      { children }
    </LoginContext.Provider>
  );
}

LoginProvider.propTypes = {
  children: PropTypes.shape().isRequired,
};

export default LoginProvider;
