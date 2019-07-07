import { rule } from 'graphql-shield';

export const isWorkspaceOwner = rule()(async (parent, { input }, ctx, info) => {
  const { id } = input;
  const relatedIds = await ctx.user.$relatedQuery('workspaces').map(related => related.id);
  return relatedIds.includes(id);
});

export default {
  isWorkspaceOwner
};
