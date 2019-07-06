import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ loading, loadingText, children, ...props }) => {
  const loadingLabel = loadingText || children;

  return (
    <button type="submit" disabled={loading} {...props}>
      {loading ? loadingLabel : children}
    </button>
  );
};

export default Button;

Button.propTypes = {
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  children: PropTypes.node.isRequired
};

Button.defaultProps = {
  loading: false,
  loadingText: null
};
