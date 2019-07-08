import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import Link from 'next/link';
import Router from 'next/router';
import { WORKSPACES } from './index';
import { withAuth } from '../../lib/with-auth';
import { useFormik } from '../../hooks/use-formik';
import Button from '../../components/button';

const New = () => {
  const createWorkspace = useMutation(CREATE_WORKSPACE);
  const Formik = useFormik({
    initialValues: { name: '' },
    onSubmit: async input => {
      await createWorkspace({
        variables: { input },
        refetchQueries: [{ query: WORKSPACES }]
      });
      Router.push('/workspaces');
    }
  });

  return (
    <>
      <h1>New workspace</h1>
      <Formik.Form>
        <label>Name</label>
        <Formik.Field name="name" type="name" placeholder="Name" />
        <Button loading={Formik.isSubmitting} loadingText="Submitting..." type="submit">
          Save
        </Button>
      </Formik.Form>
      <div>
        <Link href="/workspaces">
          <a href="/workspaces">Workspaces</a>
        </Link>
      </div>
    </>
  );
};

export default withAuth(New);

const CREATE_WORKSPACE = gql`
  mutation($input: CreateWorkspaceInput!) {
    createWorkspace(input: $input) {
      id
      name
    }
  }
`;
