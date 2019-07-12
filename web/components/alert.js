import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

const Alert = ({ type, messages }) => {
  if (messages) {
    if (Object.values(messages).length > 0) {
      return (
        <div className={`mb-5 ${classes[type]}`}>
          {_.map(messages, (val, key) => (
            <p className="mb-3" key={key}>
              {val}
            </p>
          ))}
        </div>
      );
    }
  }

  return <></>;
};

const classes = {
  success: 'px-4 pt-3 text-green-700 border border-green-400 bg-green-100 rounded',
  warning: 'px-4 pt-3 text-yellow-700 border border-yellow-400 bg-yellow-100 rounded'
};

export default Alert;

Alert.propTypes = {
  type: PropTypes.string.isRequired,
  messages: PropTypes.objectOf(PropTypes.string)
};

Alert.defaultProps = {
  messages: null
};
