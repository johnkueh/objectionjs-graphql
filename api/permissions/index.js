import { allow, shield } from 'graphql-shield';
import ValidationErrors from '../lib/validation-errors';
import { isAuthenticated } from './is-authenticated';

export const permissions = shield(
  {
    Query: {
      '*': isAuthenticated
    },
    Mutation: {
      '*': isAuthenticated,
      login: allow,
      signup: allow
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
