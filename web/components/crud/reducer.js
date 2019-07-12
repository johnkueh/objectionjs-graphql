export const reducer = (state, action) => {
  switch (action.type) {
    case actions.SHOW_CREATE:
      return {
        ...state,
        showCreate: true,
        showEdit: false,
        id: null
      };
    case actions.HIDE_CREATE:
      return {
        ...state,
        showCreate: false,
        id: initialState.id
      };
    case actions.SHOW_EDIT:
      return {
        ...state,
        showEdit: true,
        showCreate: false,
        id: action.id
      };
    case actions.HIDE_EDIT:
      return {
        ...state,
        showEdit: false,
        id: initialState.id
      };
    default:
      return initialState;
  }
};

export const initialState = {
  showCreate: false,
  showEdit: false,
  id: null
};

export const actions = {
  SHOW_CREATE: 'SHOW_CREATE',
  SHOW_EDIT: 'SHOW_EDIT',
  HIDE_CREATE: 'HIDE_CREATE',
  HIDE_EDIT: 'HIDE_EDIT'
};

export default {
  actions,
  reducer,
  initialState
};
