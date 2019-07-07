import { allow, shield } from 'graphql-shield';
import { isAuthenticated } from './is-authenticated';

export const permissions = shield({
  Query: {
    '*': isAuthenticated
  },
  Mutation: {
    '*': isAuthenticated,
    login: allow,
    signup: allow
  }
});

export default {
  permissions
};
