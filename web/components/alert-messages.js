import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Alert from './alert';

const AlertMessages = ({ messages }) => {
  if (Object.values(Object.values(messages)[0])[0]) {
    return (
      <div data-testid="alerts">
        {_.map(messages, (content, type) => (
          <Alert key={type} type={type} messages={content} />
        ))}
      </div>
    );
  }

  return <></>;
};

export default AlertMessages;

AlertMessages.propTypes = {
  messages: PropTypes.oneOfType([
    PropTypes.shape({ danger: PropTypes.objectOf(PropTypes.string) }),
    PropTypes.shape({ warning: PropTypes.objectOf(PropTypes.string) }),
    PropTypes.shape({ success: PropTypes.objectOf(PropTypes.string) }),
    PropTypes.shape({ info: PropTypes.objectOf(PropTypes.string) })
  ])
};

AlertMessages.defaultProps = {
  messages: null
};
