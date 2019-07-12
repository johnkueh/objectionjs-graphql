import { useReducer } from 'react';
import { useError } from './use-error';

export const useForm = ({ initialValues, onSubmit }) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialValues,
    ...formState
  });

  const [errors, setError, initialState] = useError();
  const { submitting, ...currentValues } = state;

  return {
    ...state,
    errors,
    submitting,
    setValue: (key, value) => {
      dispatch({
        type: 'SET_VALUE',
        name: key,
        value
      });
    },
    formProps: () => ({
      onSubmit: async e => {
        e.preventDefault();
        setError(initialState);
        dispatch({
          type: 'SET_SUBMITTING',
          submitting: true
        });
        try {
          await onSubmit({
            currentValues,
            setSubmitting: bool => {
              dispatch({
                type: 'SET_SUBMITTING',
                submitting: bool
              });
            }
          });
        } catch (error) {
          setError(error);
          dispatch({
            type: 'SET_SUBMITTING',
            submitting: false
          });
        }
      }
    }),
    fieldProps: name => {
      return {
        name,
        value: state[name],
        onChange: ({ target: { value } }) => {
          dispatch({
            type: 'SET_VALUE',
            name,
            value
          });
        }
      };
    }
  };
};

const formState = {
  submitting: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        [action.name]: action.value
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        submitting: action.submitting
      };
    default:
      return state;
  }
};

export default {
  useForm
};
