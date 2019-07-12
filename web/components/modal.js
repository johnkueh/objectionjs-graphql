import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ children, size, onHide }) => (
  <div className="fixed inset-0 flex justify-center items-center">
    <a className="z-10 absolute inset-0 bg-gray-transparent" onClick={onHide} />
    <div className={`w-full z-20 ${size}`}>{children}</div>
  </div>
);

Modal.propTypes = {
  size: PropTypes.string,
  children: PropTypes.node.isRequired
};

Modal.defaultProps = {
  size: 'max-w-md'
};
export default Modal;
