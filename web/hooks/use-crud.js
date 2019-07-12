import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { Create as CreateComponent, Edit as EditComponent } from '../components/crud';
import { actions, reducer, initialState } from '../components/crud/reducer';

export const useCrud = ({
  modelName,
  resourceQuery,
  collectionQuery,
  createMutation,
  updateMutation,
  deleteMutation
}) => {
  const [{ isCreating, isEditing, id: editingId }, dispatch] = useReducer(reducer, initialState);
  const showCreate = () => dispatch({ type: actions.SHOW_CREATE });
  const showEdit = id => dispatch({ type: actions.SHOW_EDIT, id });
  const hideEdit = id => dispatch({ type: actions.HIDE_EDIT });
  const hideCreate = () => dispatch({ type: actions.HIDE_CREATE });

  const Create = ({ fields, onCancel, onSuccess }) => (
    <>
      <CreateComponent
        modelName={modelName}
        collectionQuery={collectionQuery}
        createMutation={createMutation}
        fields={fields}
        onCancel={onCancel}
        onSuccess={onSuccess}
      />
    </>
  );
  Create.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    onCancel: PropTypes.func,
    onSuccess: PropTypes.func
  };
  Create.defaultProps = {
    onCancel: hideCreate,
    onSuccess: hideCreate
  };
  const Edit = ({ fields, onCancel, onSuccess }) => {
    if (!editingId) return null;

    return (
      <EditComponent
        modelName={modelName}
        id={editingId}
        resourceQuery={resourceQuery}
        collectionQuery={collectionQuery}
        updateMutation={updateMutation}
        deleteMutation={deleteMutation}
        fields={fields}
        onCancel={onCancel}
        onSuccess={onSuccess}
      />
    );
  };
  Edit.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    onCancel: PropTypes.func,
    onSuccess: PropTypes.func
  };
  Edit.defaultProps = {
    onCancel: hideEdit,
    onSuccess: hideCreate
  };
  return {
    isCreating,
    isEditing,
    editingId,
    showCreate,
    showEdit,
    hideEdit,
    hideCreate,
    Create,
    Edit
  };
};

export default {
  useCrud
};
