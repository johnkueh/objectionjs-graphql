import React from 'react';
import { useMutation } from 'react-apollo-hooks';
import { actions } from './reducer';
import Button from '../button';
import AlertMessages from '../alert-messages';
import { useForm } from '../../hooks/use-form';

const Create = ({ modelName, dispatch, collectionQuery, createMutation }) => {
  const performCreate = useMutation(createMutation);
  const { formProps, fieldProps, errors, submitting } = useForm({
    initialValues: {
      name: ''
    },
    onSubmit: async ({ currentValues, setSubmitting }) => {
      await performCreate({
        variables: {
          input: currentValues
        },
        refetchQueries: [{ query: collectionQuery }]
      });
      dispatch({ type: actions.HIDE_CREATE });
    }
  });

  return (
    <>
      <AlertMessages messages={{ warning: errors }} />
      <form data-testid={`${modelName}-create-form`} {...formProps()}>
        <label>Name</label>
        <input {...fieldProps('name')} type="text" placeholder="Name" />
        <Button
          data-testid={`${modelName}-form-submit`}
          loading={submitting}
          loadingText="Submitting..."
          type="submit"
        >
          Save
        </Button>
      </form>
      <button
        data-testid="cancel"
        onClick={e => {
          e.preventDefault();
          dispatch({ type: actions.HIDE_CREATE });
        }}
        type="button"
      >
        Cancel
      </button>
    </>
  );
};

export default Create;
