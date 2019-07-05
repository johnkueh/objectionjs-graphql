exports.up = function(knex) {
  return knex.schema.createTable('workspaces', table => {
    table.string('id').primary();
    table.string('name');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('workspaces');
};
