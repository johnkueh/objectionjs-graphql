import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import { useForm } from '../hooks/use-form';
import { withAuth } from '../lib/with-auth';
import Nav from '../components/nav';
import Button from '../components/button';
import AlertMessages from '../components/alert-messages';

const Profile = ({ user: { email, name } }) => {
  const [success, setSuccess] = useState(null);
  const updateUser = useMutation(UPDATE_USER);
  const { formProps, fieldProps, errors, submitting } = useForm({
    initialValues: {
      email,
      name
    },
    onSubmit: async ({ currentValues, setSubmitting }) => {
      setSuccess(null);
      await updateUser({
        variables: { input: currentValues }
      });
      setSuccess({
        user: 'Successfully updated profile'
      });
      setSubmitting(false);
    }
  });

  return (
    <div className="bg-gray-200 w-screen h-screen">
      <div className="container mx-auto">
        <Nav />
        <h1 className="font-medium text-3xl">Profile</h1>
        <form className="mt-8 max-w-xs bg-white shadow-md rounded p-8" {...formProps()}>
          <AlertMessages
            messages={{
              warning: errors,
              success
            }}
          />
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              {...fieldProps('name')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="John Doe"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              {...fieldProps('email')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              placeholder="john@doe.com"
            />
          </div>
          <Button
            loading={submitting}
            loadingText="Submitting..."
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Save
          </Button>
        </form>
      </div>
    </div>
  );
};

const UPDATE_USER = gql`
  mutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      name
      email
    }
  }
`;

export default withAuth(Profile);
