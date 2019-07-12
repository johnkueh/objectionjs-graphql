import React from 'react';
import { useQuery, useMutation } from 'react-apollo-hooks';
import { actions } from './reducer';
import Button from '../button';
import AlertMessages from '../alert-messages';
import { useForm } from '../../hooks/use-form';

const Edit = ({
  modelName,
  id,
  dispatch,
  resourceQuery,
  collectionQuery,
  updateMutation,
  deleteMutation
}) => {
  const { loading, data } = useQuery(resourceQuery, { variables: { input: { id } } });
  const resource = data[modelName];

  if (!resource) return null;

  return (
    <EditForm
      key={resource.id}
      modelName={modelName}
      resource={resource}
      dispatch={dispatch}
      collectionQuery={collectionQuery}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
    />
  );
};

const EditForm = ({
  resource,
  modelName,
  dispatch,
  collectionQuery,
  updateMutation,
  deleteMutation
}) => {
  const performUpdate = useMutation(updateMutation);
  const performDelete = useMutation(deleteMutation);
  const { formProps, fieldProps, errors, submitting } = useForm({
    initialValues: { name: resource.name },
    onSubmit: async ({ currentValues: { name }, setSubmitting }) => {
      await performUpdate({
        variables: { input: { id: resource.id, name } }
      });
      setSubmitting(false);
      dispatch({ type: actions.HIDE_EDIT });
    }
  });

  return (
    <>
      <AlertMessages messages={{ warning: errors }} />
      <form {...formProps()}>
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
        data-testid={`${modelName}-delete`}
        onClick={async e => {
          e.preventDefault();
          await performDelete({
            variables: {
              input: { id: resource.id }
            },
            refetchQueries: [{ query: collectionQuery }]
          });
          dispatch({ type: actions.HIDE_EDIT });
        }}
        type="button"
      >
        Delete
      </button>
      <button
        data-testid="cancel"
        onClick={e => {
          e.preventDefault();
          dispatch({ type: actions.HIDE_EDIT });
        }}
        type="button"
      >
        Cancel
      </button>
    </>
  );
};

export default Edit;
