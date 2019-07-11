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

    factoryCreate(params) {
      const type = Object.keys(params)[0];
      const overrides = Object.values(params)[0];
      return factory.create(type, overrides);
    }
  });
};
