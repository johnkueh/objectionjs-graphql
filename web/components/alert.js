import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

const Alert = ({ type, messages }) => {
  if (messages)
    return (
      <div className={`mb-5 ${classes[type]}`}>
        {_.map(messages, (val, key) => (
          <p className="mb-3" key={key}>
            {val}
          </p>
        ))}
      </div>
    );

  return <></>;
};

const classes = {
  success: 'px-3 pt-3 text-green-800 border border-green-300 bg-green-200 rounded',
  warning: 'px-3 pt-3 text-yellow-800 border border-yellow-300 bg-yellow-200 rounded'
};

export default Alert;

Alert.propTypes = {
  type: PropTypes.string.isRequired,
  messages: PropTypes.objectOf(PropTypes.string)
};

Alert.defaultProps = {
  messages: null
};
