import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { Model } from './base';

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get validateUniqueness() {
    return ['email'];
  }

  static get validationSchema() {
    return this.yup.object().shape({
      name: this.yup
        .string()
        .min(1)
        .max(15),
      email: this.yup
        .string()
        .email()
        .min(1),
      password: this.yup.string().min(6)
    });
  }

  static get relationMappings() {
    const { Workspace } = require('./workspace');

    return {
      workspace: {
        relation: Model.HasOneRelation,
        modelClass: Workspace,
        join: {
          from: 'users.workspaceId',
          to: 'workspaces.id'
        }
      }
    };
  }

  async $beforeInsert(context) {
    await super.$beforeInsert(context);
    this.hashPassword();
  }

  async $beforeUpdate(options, context) {
    await super.$beforeUpdate(options, context);
    this.hashPassword();
  }

  hashPassword() {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }

  validPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  get jwt() {
    const { id, email } = this;
    return jwtSign({ id, email });
  }
}

export default User;

const JWTSECRET = 'JWTSECRET';
const jwtSign = ({ id, email }) => jsonwebtoken.sign({ id, email }, JWTSECRET);
