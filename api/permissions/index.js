import { allow, and, shield } from 'graphql-shield';
import ValidationErrors from '../lib/validation-errors';
import { isAuthenticated } from './is-authenticated';
import { isWorkspaceOwner } from './is-workspace-owner';
import { isLogoOwner } from './is-image-owner';

export const permissions = shield(
  {
    Query: {
      '*': isAuthenticated,
      workspace: and(isAuthenticated, isWorkspaceOwner)
    },
    Mutation: {
      '*': isAuthenticated,
      login: allow,
      signup: allow,
      updateWorkspace: and(isAuthenticated, isWorkspaceOwner),
      deleteWorkspace: and(isAuthenticated, isWorkspaceOwner),
      deleteImage: and(isAuthenticated, isLogoOwner)
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
