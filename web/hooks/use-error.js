import { useState } from 'react';

const initialState = {};

export const useError = () => {
  const [messages, setMessages] = useState(initialState);

  return [
    messages,
    error => {
      if (!error || !error.graphQLErrors) {
        return setMessages(initialState);
      }

      return setMessages(error.graphQLErrors[0].extensions.exception.errors);
    },
    initialState
  ];
};

export default {
  useError
};
