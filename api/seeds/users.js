exports.seed = function(knex) {
  return knex("users")
    .del()
    .then(function() {
      return knex("users").insert([
        {
          id: 1,
          email: "john@beaconmaker.com",
          name: "John Beaconmaker",
          workspaceId: 1
        },
        {
          id: 2,
          email: "john.kueh@gmail.com",
          name: "John Kueh",
          workspaceId: 2
        },
        { id: 3, email: "john@zibbet.com", name: "John Zibbet", workspaceId: 3 }
      ]);
    });
};
