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
      <AlertMessages messages={{ warning: errors }} />
      <form data-testid={`${modelName}-create-form`} {...formProps()}>
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
        data-testid="cancel"
        onClick={e => {
          e.preventDefault();
          onCancel();
        }}
        type="button"
      >
        Cancel
      </button>
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
