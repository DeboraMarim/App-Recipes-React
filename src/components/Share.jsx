import React, { useState } from 'react';
import copy from 'clipboard-copy';
import PropTypes from 'prop-types';

function Share({ dataTestId, destinationUrl }) {
  const [showCopied, setShowCopied] = useState(false);
  return (
    <article>
      <button
        onClick={ () => copy(destinationUrl).then(() => {
          setShowCopied(true);
        }) }
      >
        <img
          data-testid={ dataTestId }
          src={ shareIcon }
          alt="share icon"
        />
        {showCopied && 'Link copiado!'}
      </button>
    </article>
  );
}

Share.propTypes = {
  dataTestId: PropTypes.string.isRequired,
  destinationUrl: PropTypes.string.isRequired,
};

export default Share;
