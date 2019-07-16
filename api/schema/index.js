import { objectType } from 'nexus';
import Workspace from '../models/workspace';
import { crudType } from '../lib/nexus-objection';

export const DeletedType = objectType({
  name: 'DeletePayload',
  definition(t) {
    t.int('count');
  }
});

export const WorkspaceCrudType = crudType({
  model: Workspace,
  owner: ctx => ctx.user,
  modelFields: {
    definition(t) {
      t.id('id');
      t.string('name');
    }
  },
  createInputFields: {
    definition(t) {
      t.string('name', { required: true });
    }
  },
  updateInputFields: {
    definition(t) {
      t.string('id', { required: true });
      t.string('name', { required: true });
    }
  }
});

export * from './user';
export * from './image';
