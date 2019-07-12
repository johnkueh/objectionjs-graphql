import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from 'react-apollo-hooks';
import { actions } from './reducer';
import Button from '../button';
import AlertMessages from '../alert-messages';
import { useForm } from '../../hooks/use-form';

const Edit = props => {
  const { id, modelName, resourceQuery, ...editProps } = props;
  const { loading, data } = useQuery(resourceQuery, { variables: { input: { id } } });
  const resource = data[modelName];

  if (!resource) return null;

  return <EditForm {...editProps} key={resource.id} modelName={modelName} resource={resource} />;
};

Edit.propTypes = {
  id: PropTypes.string.isRequired,
  modelName: PropTypes.string.isRequired,
  resourceQuery: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object])
  ).isRequired
};

const EditForm = ({
  resource,
  fields,
  modelName,
  dispatch,
  collectionQuery,
  updateMutation,
  deleteMutation
}) => {
  const initialValues = {};
  fields.forEach(({ name, type }) => {
    // TODO: Handle different types?
    initialValues[name] = resource[name];
  });
  const performUpdate = useMutation(updateMutation);
  const performDelete = useMutation(deleteMutation);
  const { formProps, fieldProps, errors, submitting } = useForm({
    initialValues,
    onSubmit: async ({ currentValues, setSubmitting }) => {
      const inputValues = {};
      fields.forEach(({ name }) => {
        inputValues[name] = currentValues[name];
      });

      const input = {
        id: resource.id,
        ...inputValues
      };
      await performUpdate({
        variables: { input }
      });
      dispatch({ type: actions.HIDE_EDIT });
    }
  });

  return (
    <>
      <AlertMessages messages={{ warning: errors }} />
      <form {...formProps()}>
        {fields.map(({ name, label, ...props }) => (
          <div key={name}>
            <label>{label}</label>
            <input {...fieldProps(name)} {...props} />
          </div>
        ))}
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

EditForm.propTypes = {
  resource: PropTypes.objectOf(PropTypes.string).isRequired,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  modelName: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  collectionQuery: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object])
  ).isRequired,
  updateMutation: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object])
  ).isRequired,
  deleteMutation: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object])
  ).isRequired
};

export default Edit;
