import { ApolloServer } from 'apollo-server-lambda';
import Knex from 'knex';
import { Model } from 'objection';
import jsonwebtoken from 'jsonwebtoken';
import cookie from 'cookie';
import { makeSchema } from 'nexus';
import { applyMiddleware } from 'graphql-middleware';
import * as types from '../schema';
import { permissions } from '../permissions';
import connection from '../knexfile';
import User from '../models/user';

const knexConnection = Knex(connection[process.env.NODE_ENV]);
Model.knex(knexConnection);

const schema = applyMiddleware(
  makeSchema({
    types,
    outputs: false,
    shouldGenerateArtifacts: false
  }),
  permissions
);

const userContext = async ({ event }) => {
  let user = null;

  try {
    const { jwt } = cookie.parse(event.headers.Cookie);
    if (jwt) {
      const hash = jsonwebtoken.verify(jwt, JWTSECRET);
      user = await User.query().findById(hash.id);
    }
  } catch (error) {
    // console.log('jwt error', error);
    // Token not valid
  }

  return {
    user
  };
};

export const makeServer = ({ context }) =>
  new ApolloServer({
    introspection: true,
    playground: true,
    schema,
    context
  });

const server = makeServer({
  context: userContext
});

export const JWTSECRET = 'JWTSECRET';
export const jwtSign = ({ id, email }) => jsonwebtoken.sign({ id, email }, JWTSECRET);

export const graphqlHandler = server.createHandler({
  path: '/prod/graphql',
  cors: {
    origin: '*'
  }
});
