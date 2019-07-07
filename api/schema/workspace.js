import { objectType, inputObjectType, queryField, mutationField, arg } from 'nexus';
import ValidationErrors from '../lib/validation-errors';
import Workspace from '../models/workspace';

export const WorkspaceType = objectType({
  name: 'Workspace',
  definition(t) {
    t.id('id');
    t.string('name');
  }
});

export const WorkspacesQuery = queryField('workspaces', {
  type: WorkspaceType,
  list: true,
  resolve: async (parent, args, ctx) => {
    const owner = ctx.user;
    const query = Workspace.query();
    const relatedIds = await owner.$relatedQuery('workspaces').map(({ id }) => id);
    return query.where('id', 'IN', relatedIds);
  }
});

export const CreateWorkspaceInputType = inputObjectType({
  name: 'CreateWorkspaceInput',
  definition(t) {
    t.string('name', { required: true });
  }
});

export const CreateWorkspaceMutation = mutationField('createWorkspace', {
  type: WorkspaceType,
  args: {
    input: arg({
      type: CreateWorkspaceInputType,
      required: true
    })
  },
  resolve: async (parent, { input }, ctx) => {
    const workspace = await Workspace.query().insert(input);
    await workspace.$relatedQuery('users').relate(ctx.user.id);
    return workspace;
  }
});

export const UpdateWorkspaceInputType = inputObjectType({
  name: 'UpdateWorkspaceInput',
  definition(t) {
    t.string('id', { required: true });
    t.string('name', { required: true });
  }
});

export const UpdateWorkspaceMutation = mutationField('updateWorkspace', {
  type: WorkspaceType,
  args: {
    input: arg({
      type: UpdateWorkspaceInputType,
      required: true
    })
  },
  resolve: async (parent, { input }, ctx) => {
    const { id } = input;
    const owner = ctx.user;
    const relatedIds = await owner.$relatedQuery('workspaces').map(related => related.id);
    if (relatedIds.includes(id)) {
      return Workspace.query().patchAndFetchById(id, input);
    }

    throw ValidationErrors({
      auth: 'You are not authorized to perform this action'
    });
  }
});

export const DeleteWorkspaceInputType = inputObjectType({
  name: 'DeleteWorkspaceInput',
  definition(t) {
    t.string('id', { required: true });
  }
});

export const DeleteWorkspaceMutation = mutationField('deleteWorkspace', {
  type: 'DeletePayload',
  args: {
    input: arg({
      type: DeleteWorkspaceInputType,
      required: true
    })
  },
  resolve: async (parent, { input }, ctx) => {
    const { id } = input;
    const owner = ctx.user;
    const relatedIds = await owner.$relatedQuery('workspaces').map(related => related.id);
    if (relatedIds.includes(id)) {
      return { count: await Workspace.query().deleteById(id) };
    }

    throw ValidationErrors({
      auth: 'You are not authorized to perform this action'
    });
  }
});