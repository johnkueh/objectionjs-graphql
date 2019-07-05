import React from 'react';
import Router from 'next/router';
import { Formik, Form, Field } from 'formik';
import Link from 'next/link';
import gql from 'graphql-tag';
import Cookies from 'js-cookie';
import { useMutation } from 'react-apollo-hooks';
import { useError } from '../lib/use-error';
import Button from '../components/button';
import AlertMessages from '../components/alert-messages';

const LOGIN = gql`
  mutation($input: LoginInput!) {
    login(input: $input) {
      jwt
      user {
        name
        email
      }
    }
  }
`;

const Login = () => {
  const login = useMutation(LOGIN);
  const [messages, setError] = useError();

  return (
    <>
      <h2>Login</h2>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={async ({ email, password }, { setSubmitting }) => {
          try {
            const {
              data: {
                login: { user, jwt }
              }
            } = await login({
              variables: {
                input: { email, password }
              }
            });

            Cookies.set('jwt', jwt);
            Router.push('/start');
          } catch (error) {
            setError(error);
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="mt-3">
            <AlertMessages messages={{ warning: messages }} />
            <Field
              name="email"
              className="form-control mb-3"
              type="email"
              placeholder="Email address"
            />
            <Field
              name="password"
              className="form-control mb-3"
              type="password"
              placeholder="Password"
            />
            <div className="mt-4">
              <Button
                loading={isSubmitting}
                loadingText="Logging in..."
                className="btn btn-block btn-primary"
                type="submit"
              >
                Log in
              </Button>
            </div>
            <div className="mt-3">
              <div>
                Dont have an account?&nbsp;
                <Link href="/signup">
                  <a href="/signup">Sign up</a>
                </Link>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Login;
