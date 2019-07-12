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
  const Create = ({ fields }) => (
    <>
      <CreateComponent
        modelName={modelName}
        collectionQuery={collectionQuery}
        createMutation={createMutation}
        dispatch={dispatch}
        fields={fields}
      />
    </>
  );
  Create.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.object).isRequired
  };
  const Edit = ({ fields }) => (
    <EditComponent
      modelName={modelName}
      id={editingId}
      resourceQuery={resourceQuery}
      collectionQuery={collectionQuery}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      dispatch={dispatch}
      fields={fields}
    />
  );
  Edit.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.object).isRequired
  };
  return {
    isCreating,
    isEditing,
    editingId,
    showCreate: () => dispatch({ type: actions.SHOW_CREATE }),
    showEdit: id => dispatch({ type: actions.SHOW_EDIT, id }),
    hideEdit: id => dispatch({ type: actions.HIDE_EDIT }),
    hideCreate: () => dispatch({ type: actions.HIDE_CREATE }),
    Create,
    Edit
  };
};

export default {
  useCrud
};
