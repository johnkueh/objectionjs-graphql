import React from 'react';
import Router from 'next/router';
import gql from 'graphql-tag';
import Cookies from 'js-cookie';
import { useMutation } from 'react-apollo-hooks';
import { useFormik } from '../hooks/use-formik';
import NavLink from '../components/nav-link';
import Button from '../components/button';
import AlertMessages from '../components/alert-messages';

const Signup = () => {
  const signup = useMutation(SIGNUP);
  const Formik = useFormik({
    initialValues: { email: '', name: '', password: '' },
    onSubmit: async input => {
      const {
        data: {
          signup: { jwt }
        }
      } = await signup({
        variables: { input }
      });
      Cookies.set('jwt', jwt);
      Router.push('/start');
    }
  });

  return (
    <>
      <h2>Sign up</h2>
      <Formik.Form>
        <AlertMessages messages={{ warning: Formik.errors }} />
        <Formik.Field name="email" type="email" placeholder="Email address" />
        <Formik.Field name="password" type="password" placeholder="Password" />
        <Formik.Field name="name" type="text" placeholder="Name" />
        <Button loading={Formik.isSubmitting} loadingText="Submitting..." type="submit">
          Log in
        </Button>
        <p>Have an account?&nbsp;</p>
        <NavLink href="/login">Log in</NavLink>
      </Formik.Form>
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
