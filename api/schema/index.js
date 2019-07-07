import { objectType } from 'nexus';

export const DeletedType = objectType({
  name: 'DeletePayload',
  definition(t) {
    t.int('count');
  }
});

export * from './user';
export * from './workspace';
