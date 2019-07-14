import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ loading, className, children, ...props }) => {
  const disabledClass = loading ? `${className} opacity-50 cursor-not-allowed` : className;

  return (
    <button className={disabledClass} type="submit" disabled={loading} {...props}>
      {loading ? <img alt="spinner" width="25" src="/static/tail-spin.svg" /> : children}
    </button>
  );
};

export default Button;

Button.propTypes = {
  loading: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

Button.defaultProps = {
  loading: false,
  className: ''
};
