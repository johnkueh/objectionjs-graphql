import React from 'react';
import PropTypes from 'prop-types';
import Spinner from './spinner';

const Button = ({ loading, className, children, ...props }) => {
  const disabledClass = loading ? `${className} opacity-50 cursor-not-allowed` : className;

  return (
    <button className={disabledClass} type="submit" disabled={loading} {...props}>
      {loading ? <Spinner width="25px" height="25px" /> : children}
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
