import React, { useReducer } from 'react';
import { Create, Edit } from '../components/crud';
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

  return {
    isCreating,
    isEditing,
    editingId,
    showCreate: () => dispatch({ type: actions.SHOW_CREATE }),
    showEdit: id => dispatch({ type: actions.SHOW_EDIT, id }),
    hideEdit: id => dispatch({ type: actions.HIDE_EDIT }),
    hideCreate: () => dispatch({ type: actions.HIDE_CREATE }),
    Create: props => (
      <>
        <Create
          modelName={modelName}
          collectionQuery={collectionQuery}
          createMutation={createMutation}
          dispatch={dispatch}
          fields={[{ label: 'Name', name: 'name', type: 'text', placeholder: 'Name' }]}
        />
      </>
    ),
    Edit: props => (
      <Edit
        modelName={modelName}
        id={editingId}
        resourceQuery={resourceQuery}
        collectionQuery={collectionQuery}
        updateMutation={updateMutation}
        deleteMutation={deleteMutation}
        dispatch={dispatch}
        fields={[{ label: 'Name', name: 'name', type: 'text', placeholder: 'Name' }]}
      />
    )
  };
};

export default {
  useCrud
};
