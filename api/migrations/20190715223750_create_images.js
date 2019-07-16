exports.up = function(knex) {
  return knex.schema.createTable('images', table => {
    table.string('id').primary();
    table.integer('position');
    table.string('publicId');
    table.string('caption');
    table.string('imageableId');
    table.string('imageableType');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('images');
};
