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
    <div className="bg-gray-200 w-screen h-screen flex items-center justify-center">
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded p-10" {...formProps()}>
          <h1 className="mb-5 font-bold text-xl">GraphQL Example</h1>
          <AlertMessages messages={{ warning: errors }} />
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              {...fieldProps('email')}
              data-testid="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              placeholder="john@doe.com"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              {...fieldProps('password')}
              data-testid="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              placeholder="Your password"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              {...fieldProps('name')}
              data-testid="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="John Doe"
            />
          </div>
          <Button
            data-testid="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            loading={submitting}
            loadingText="Submitting..."
            type="submit"
          >
            Sign up
          </Button>
          <p>
            <NavLink className="text-blue-500 block mt-4" href="/login">
              Log in
            </NavLink>
          </p>
        </form>
      </div>
    </div>
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
