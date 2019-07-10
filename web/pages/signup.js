import React from 'react';
import Router from 'next/router';
import gql from 'graphql-tag';
import Cookies from 'js-cookie';
import { useMutation } from 'react-apollo-hooks';
import { useForm } from '../hooks/use-form';
import NavLink from '../components/nav-link';
import Button from '../components/button';
import AlertMessages from '../components/alert-messages';

const Signup = () => {
  const signup = useMutation(SIGNUP);
  const { formProps, fieldProps, errors, submitting } = useForm({
    initialValues: {
      email: '',
      name: '',
      password: ''
    },
    onSubmit: async ({ currentValues, setSubmitting }) => {
      const {
        data: {
          signup: { jwt }
        }
      } = await signup({
        variables: { input: currentValues }
      });
      setSubmitting(false);
      Cookies.set('jwt', jwt);
      Router.push('/start');
    }
  });

  return (
    <>
      <h2>Sign up</h2>
      <form {...formProps()}>
        <AlertMessages messages={{ warning: errors }} />
        <label>Email</label>
        <input {...fieldProps('email')} type="email" placeholder="john@doe.com" />
        <label>Password</label>
        <input {...fieldProps('password')} type="password" placeholder="Your password" />
        <label>Name</label>
        <input {...fieldProps('name')} type="text" placeholder="John Doe" />
        <Button loading={submitting} loadingText="Submitting..." type="submit">
          Sign up
        </Button>
        <p>
          <NavLink href="/login">Log in</NavLink>
        </p>
      </form>
    </>
  );
};

const SIGNUP = gql`
  mutation($input: SignupInput!) {
    signup(input: $input) {
      jwt
      user {
        name
        email
      }
    }
  }
`;

export default Signup;
