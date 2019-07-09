import React from 'react';
import Router from 'next/router';
import gql from 'graphql-tag';
import Cookies from 'js-cookie';
import { useMutation } from 'react-apollo-hooks';
import { useFormik } from '../hooks/use-formik';
import NavLink from '../components/nav-link';
import Button from '../components/button';
import AlertMessages from '../components/alert-messages';

const Login = () => {
  const login = useMutation(LOGIN);
  const Formik = useFormik({
    initialValues: { email: '', password: '' },
    onSubmit: async input => {
      const {
        data: {
          login: { jwt }
        }
      } = await login({
        variables: { input }
      });
      Cookies.set('jwt', jwt);
      Router.push('/start');
    }
  });

  return (
    <>
      <h2>Login</h2>
      <Formik.Form>
        <AlertMessages messages={{ warning: Formik.errors }} />
        <Formik.Field name="email" type="email" placeholder="Email address" />
        <Formik.Field name="password" type="password" placeholder="Password" />
        <Button loading={Formik.isSubmitting} loadingText="Logging in..." type="submit">
          Log in
        </Button>
        <p>Dont have an account?&nbsp;</p>
        <NavLink href="/signup">Sign up</NavLink>
        <NavLink href="/start">Start</NavLink>
      </Formik.Form>
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
