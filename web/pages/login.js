import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import gql from 'graphql-tag';
import Cookies from 'js-cookie';
import { useMutation } from 'react-apollo-hooks';
import { useFormik } from '../hooks/use-formik';
import Button from '../components/button';
import AlertMessages from '../components/alert-messages';

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
        <Link href="/signup">
          <a href="/signup">Sign up</a>
        </Link>
        <Link href="/start">
          <a href="/start">Start</a>
        </Link>
      </Formik.Form>
    </>
  );
};

export default Login;
