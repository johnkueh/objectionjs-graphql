import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';
import Button from '../button';
import AlertMessages from '../alert-messages';
import { useForm } from '../../hooks/use-form';

const Create = ({ modelName, fields, onCancel, onSuccess, collectionQuery, createMutation }) => {
  const initialValues = {};
  fields.forEach(({ name, type }) => {
    // TODO: Handle different types?
    initialValues[name] = '';
  });
  const performCreate = useMutation(createMutation);
  const { formProps, fieldProps, errors, submitting } = useForm({
    initialValues,
    onSubmit: async ({ currentValues, setSubmitting }) => {
      await performCreate({
        variables: {
          input: currentValues
        },
        refetchQueries: [{ query: collectionQuery }]
      });
      setSubmitting(false);
      onSuccess();
    }
  });

  return (
    <>
      <form
        className="mt-8 bg-white shadow-md rounded p-6"
        data-testid={`${modelName}-create-form`}
        {...formProps()}
      >
        <h3 className="text-lg font-medium mb-5">
          Add a new&nbsp;
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
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Save
          </Button>
          <button
            data-testid="cancel"
            onClick={e => {
              e.preventDefault();
              onCancel();
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded"
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

Create.propTypes = {
  modelName: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCancel: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  collectionQuery: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object])
  ).isRequired,
  createMutation: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object])
  ).isRequired
};

export default Create;
