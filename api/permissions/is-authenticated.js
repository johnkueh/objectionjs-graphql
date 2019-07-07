import get from 'lodash/get';
import { rule } from 'graphql-shield';

export const isAuthenticated = rule()((parent, args, ctx) => {
  if (get(ctx, 'user.id')) {
    return true;
  }

  return false;
});

export default {
  isAuthenticated
};
