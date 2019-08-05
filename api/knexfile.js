module.exports = {
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },
  development: {
    client: 'pg',
    connection: 'postgres://root@localhost:5432/objectionjs-graphql-dev'
  },
  test: {
    client: 'pg',
    connection: 'postgres://root@localhost:5432/objectionjs-graphql-test'
  }
};
