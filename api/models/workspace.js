const { Model } = require('./base');

class Workspace extends Model {
  static get tableName() {
    return 'workspaces';
  }
}

export default Workspace;
