import { Model } from './base';

class Workspace extends Model {
  static get tableName() {
    return 'workspaces';
  }

  static get validationSchema() {
    return this.yup.object().shape({
      name: this.yup
        .string()
        .min(1)
        .max(15)
    });
  }

  static get relationMappings() {
    const User = require('./user').default;

    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: 'workspaces.id',
          through: {
            from: 'users_workspaces.workspaceId',
            to: 'users_workspaces.userId'
          },
          to: 'users.id'
        }
      }
    };
  }
}

export default Workspace;
