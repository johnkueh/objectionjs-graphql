import { rule } from 'graphql-shield';

export const isLogoOwner = rule()(async (parent, { input }, ctx, info) => {
  const { id } = input;
  const logo = await ctx.user.$relatedQuery('logo');
  return logo.id === id;
});

export default {
  isLogoOwner
};
