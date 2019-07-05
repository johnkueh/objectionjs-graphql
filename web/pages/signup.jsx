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

const Signup = () => {
  const signup = useMutation(SIGNUP);
  const [messages, setError] = useError();

  return (
    <>
      <h2>Sign up</h2>
      <Formik
        initialValues={{ email: '', name: '', password: '' }}
        onSubmit={async ({ email, name, password }, { setSubmitting }) => {
          try {
            const {
              data: {
                signup: { jwt }
              }
            } = await signup({
              variables: {
                input: { email, name, password }
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
            <Field name="name" className="form-control mb-3" type="text" placeholder="Name" />
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
              Have an account?&nbsp;
              <Link href="/login">
                <a href="/login">Log in</a>
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Signup;