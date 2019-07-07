import { allow, and, shield } from 'graphql-shield';
import ValidationErrors from '../lib/validation-errors';
import { isAuthenticated } from './is-authenticated';
import { isWorkspaceOwner } from './is-workspace-owner';

export const permissions = shield(
  {
    Query: {
      '*': isAuthenticated
    },
    Mutation: {
      '*': isAuthenticated,
      login: allow,
      signup: allow,
      updateWorkspace: and(isAuthenticated, isWorkspaceOwner),
      deleteWorkspace: and(isAuthenticated, isWorkspaceOwner)
    }
  },
  {
    fallbackError: ValidationErrors({
      auth: 'You are not authorized to perform this action'
    })
  }
);

export default {
  permissions
};
