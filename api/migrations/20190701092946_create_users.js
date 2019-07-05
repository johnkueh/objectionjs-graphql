exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.string('id').primary();
    table.string('email');
    table.string('name');
    table.string('password');
    table.string('workspaceId');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
