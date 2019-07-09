import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import { useFormik } from '../hooks/use-formik';
import { withAuth } from '../lib/with-auth';
import NavLink from '../components/nav-link';
import Button from '../components/button';
import AlertMessages from '../components/alert-messages';

const Profile = ({ user: { email, name } }) => {
  const [success, setSuccess] = useState(null);
  const updateUser = useMutation(UPDATE_USER);
  const Formik = useFormik({
    initialValues: { name, email },
    onSubmit: async input => {
      setSuccess(null);
      await updateUser({
        variables: { input }
      });
      setSuccess({
        user: 'Successfully updated profile'
      });
    }
  });
  return (
    <>
      <h1>Profile</h1>
      <Formik.Form>
        <AlertMessages
          messages={{
            warning: Formik.errors,
            success
          }}
        />
        <Formik.Field name="name" type="name" placeholder="Name" />
        <Formik.Field name="email" type="email" placeholder="Email address" />
        <Button loading={Formik.isSubmitting} loadingText="Submitting..." type="submit">
          Save
        </Button>
      </Formik.Form>

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
