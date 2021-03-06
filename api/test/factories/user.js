import factory from '../support/factory-with-adapter';
import User from '../../models/user';

factory.define('user', User, {
  email: 'john.doe@example.com',
  name: 'John Doe',
  password: 'test-password',
  workspaceId: null
});

factory.extend(
  'user',
  'userWithWorkspace',
  {},
  {
    afterCreate: async (model, attrs, buildOptions) => {
      await model.$relatedQuery('workspaces').insert({ name: 'User Workspace' });
      return model;
    }
  }
);
