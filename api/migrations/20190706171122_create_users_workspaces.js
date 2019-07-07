exports.up = function(knex) {
  return knex.schema.createTable('users_workspaces', table => {
    table.string('userId');
    table.string('workspaceId');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users_workspaces');
};
