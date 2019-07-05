import { useState } from 'react';

export const useError = () => {
  const [messages, setMessages] = useState({});

  return [
    messages,
    error => {
      setMessages(error.graphQLErrors[0].extensions.exception.errors);
    }
  ];
};
