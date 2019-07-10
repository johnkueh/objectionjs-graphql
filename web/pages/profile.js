import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import { useForm } from '../hooks/use-form';
import { withAuth } from '../lib/with-auth';
import NavLink from '../components/nav-link';
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
    <>
      <h1>Profile</h1>
      <form {...formProps()}>
        <AlertMessages
          messages={{
            warning: errors,
            success
          }}
        />
        <input {...fieldProps('name')} type="text" placeholder="John Doe" />
        <input {...fieldProps('email')} type="email" placeholder="john@doe.com" />
        <Button loading={submitting} loadingText="Submitting..." type="submit">
          Save
        </Button>
      </form>

      <div>
        <NavLink href="/start">Start</NavLink>
      </div>
    </>
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
