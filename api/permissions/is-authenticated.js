import get from 'lodash/get';
import { rule } from 'graphql-shield';
import ValidationErrors from '../lib/validation-errors';

export const isAuthenticated = rule()((parent, args, ctx) => {
  if (get(ctx, 'user.id')) {
    return true;
  }

  return ValidationErrors({
    auth: 'You are not authorized to perform this action'
  });
});

export default {
  isAuthenticated
};
