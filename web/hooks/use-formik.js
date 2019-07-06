import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field as FormikField } from 'formik';
import { useError } from './use-error';

export const useFormik = ({ initialValues, onSubmit }) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [errorMessages, setError, initialState] = useError();

  const FormikForm = useCallback(({ children }) => {
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, options) => {
          setError(initialState);
          setSubmitting(true);
          try {
            await onSubmit(values, options);
            setSubmitting(false);
          } catch (error) {
            setError(error);
            setSubmitting(false);
          }
        }}
      >
        {({ values }) => <Form>{children}</Form>}
      </Formik>
    );
  }, []);

  FormikForm.propTypes = {
    children: PropTypes.node.isRequired
  };

  return {
    Form: FormikForm,
    Field: FormikField,
    errors: errorMessages,
    values: {},
    isSubmitting
  };
};

export default {
  useFormik
};
