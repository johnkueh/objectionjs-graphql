import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import { useForm } from '../hooks/use-form';
import AlertMessages from '../components/alert-messages';

const Test = () => {
  const login = useMutation(LOGIN);
  const { formProps, fieldProps, errors, submitting } = useForm({
    initialValues: {
      email: 'hello@beaconmaker.com',
      password: ''
    },
    onSubmit: async ({ currentValues, setSubmitting }) => {
      const { email, password } = currentValues;
      await login({
        variables: {
          input: { email, password }
        }
      });
      setSubmitting(false);
    }
  });

  return (
    <div>
      <h3>Test form</h3>
      <form {...formProps()}>
        <AlertMessages messages={{ warning: errors }} />
        <label>Email</label>
        <input {...fieldProps('email')} type="email" placeholder="john@doe.com" />
        <label>Password</label>
        <input {...fieldProps('password')} type="password" placeholder="Your password" />
        <button disabled={submitting} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Test;

const LOGIN = gql`
  mutation($input: LoginInput!) {
    login(input: $input) {
      jwt
      user {
        id
        name
        email
      }
    }
  }
`;
