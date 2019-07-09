import React from 'react';
import get from 'lodash/get';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo-hooks';
import Router, { withRouter } from 'next/router';
import { WORKSPACE } from './show';
import PageLoading from '../../components/page-loading';
import NavLink from '../../components/nav-link';
import { withAuth } from '../../lib/with-auth';
import { useFormik } from '../../hooks/use-formik';
import Button from '../../components/button';

const Edit = ({
  router: {
    query: { id }
  }
}) => {
  const updateWorkspace = useMutation(UPDATE_WORKSPACE);
  const {
    loading,
    data: { workspace }
  } = useQuery(WORKSPACE, { variables: { input: { id } } });
  const Formik = useFormik({
    initialValues: { id: get(workspace, 'id'), name: get(workspace, 'name') },
    onSubmit: async input => {
      await updateWorkspace({
        variables: { input }
      });
      Router.push(`/workspaces/${id}`);
    }
  });

  if (loading) return <PageLoading />;

  return (
    <>
      <h1>Edit Workspace</h1>
      <Formik.Form>
        <label>Name</label>
        <Formik.Field name="name" type="name" placeholder="Name" />
        <Button loading={Formik.isSubmitting} loadingText="Submitting..." type="submit">
          Save
        </Button>
      </Formik.Form>
      <div>
        <NavLink href={`/workspaces/show?id=${id}`} as={`/workspaces/${id}`}>
          View
        </NavLink>
      </div>
      <hr />
      <div>
        <NavLink href="/workspaces">Workspaces</NavLink>
      </div>
    </>
  );
};

export default withAuth(withRouter(Edit));

export const UPDATE_WORKSPACE = gql`
  mutation($input: UpdateWorkspaceInput!) {
    updateWorkspace(input: $input) {
      id
      name
    }
  }
`;
