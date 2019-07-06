import { useState } from 'react';

const initialState = {};

export const useError = () => {
  const [messages, setMessages] = useState(initialState);

  return [
    messages,
    error => {
      if (error.graphQLErrors[0]) {
        setMessages(error.graphQLErrors[0].extensions.exception.errors);
      } else {
        setMessages(initialState);
      }
    }
  ];
};

export default {
  useError
};
