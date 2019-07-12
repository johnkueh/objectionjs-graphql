require('@babel/register')({
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ]
  ]
});

require('../../test/factories');
const factory = require('factory-girl').factory;
const Knex = require('knex');
const { Model } = require('objection');
const connection = require('../../knexfile');
const User = require('../../models/user').default;

module.exports = (on, config) => {
  const knexConnection = Knex(connection.development);
  Model.knex(knexConnection);

  on('task', {
    deleteUser(email) {
      return User.query()
        .delete()
        .where('email', email);
    },

    factory({ method, type, args, include }) {
      return new Promise(async res => {
        const created = await factory[method](type, args);
        const result = created.toJSON();
        if (include) {
          include.map(key => {
            result[key] = created[key];
          });
        }
        res(result);
      });
    }
  });
};
