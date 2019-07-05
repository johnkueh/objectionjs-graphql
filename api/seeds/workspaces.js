exports.seed = function(knex) {
  return knex('workspaces')
    .del()
    .then(function() {
      return knex('workspaces').insert([
        {
          id: 1,
          name: 'Workspace 1'
        },
        {
          id: 2,
          name: 'Workspace 2'
        },
        {
          id: 3,
          name: 'Workspace 3'
        }
      ]);
    });
};
