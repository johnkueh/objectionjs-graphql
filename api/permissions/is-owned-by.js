import get from 'lodash/get';
import { rule } from 'graphql-shield';

export const isOwnedBy = rule()((parent, args, ctx) => {
  return true;
});

export default {
  isOwnedBy
};
