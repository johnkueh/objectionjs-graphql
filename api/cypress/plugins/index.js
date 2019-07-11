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
    }
  });
};
