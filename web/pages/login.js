import React from 'react';
import Router from 'next/router';
import gql from 'graphql-tag';
import Cookies from 'js-cookie';
import { useMutation } from 'react-apollo-hooks';
import { useForm } from '../hooks/use-form';
import NavLink from '../components/nav-link';
import Button from '../components/button';
import AlertMessages from '../components/alert-messages';

const Login = () => {
  const login = useMutation(LOGIN);
  const { formProps, fieldProps, errors, submitting } = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async ({ currentValues, setSubmitting }) => {
      const {
        data: {
          login: { jwt }
        }
      } = await login({
        variables: { input: currentValues }
      });
      setSubmitting(false);
      Cookies.set('jwt', jwt);
      Router.push('/start');
    }
  });

  return (
    <>
      <h2>Login</h2>
      <form {...formProps()}>
        <AlertMessages messages={{ warning: errors }} />
        <label>Email</label>
        <input
          data-testid="email"
          {...fieldProps('email')}
          type="email"
          placeholder="john@doe.com"
        />
        <label>Password</label>
        <input
          data-testid="password"
          {...fieldProps('password')}
          type="password"
          placeholder="Your password"
        />
        <Button data-testid="submit" loading={submitting} loadingText="Logging in..." type="submit">
          Log in
        </Button>
        <p>
          <NavLink href="/signup">Sign up</NavLink>
        </p>
      </form>
    </>
  );
};

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

export default Login;
