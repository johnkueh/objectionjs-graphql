import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from 'react-apollo-hooks';
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
  collectionQuery,
  updateMutation,
  deleteMutation,
  onCancel,
  onSuccess
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
      onSuccess();
    }
  });

  return (
    <>
      <form className="mt-8 max-w-xs bg-white shadow-md rounded p-6" {...formProps()}>
        <h3 className="text-lg font-medium mb-5">
          Edit&nbsp;
          {modelName}
        </h3>
        <AlertMessages messages={{ warning: errors }} />
        {fields.map(({ name, label, ...props }) => (
          <div className="mb-4" key={name}>
            <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
            <input
              {...fieldProps(name)}
              {...props}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}
        <div className="mt-8 flex w-full justify-between">
          <Button
            data-testid={`${modelName}-form-submit`}
            loading={submitting}
            loadingText="Submitting..."
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Save
          </Button>
          <button
            data-testid={`${modelName}-delete`}
            className="bg-red-200 hover:bg-red-300 text-red-600 font-bold py-2 px-4 rounded"
            onClick={async e => {
              e.preventDefault();
              await performDelete({
                variables: {
                  input: { id: resource.id }
                },
                refetchQueries: [{ query: collectionQuery }]
              });
              onSuccess();
            }}
            type="button"
          >
            Delete
          </button>
          <button
            data-testid="cancel"
            className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded"
            onClick={e => {
              e.preventDefault();
              onCancel();
            }}
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

EditForm.propTypes = {
  resource: PropTypes.objectOf(PropTypes.string).isRequired,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  modelName: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
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
