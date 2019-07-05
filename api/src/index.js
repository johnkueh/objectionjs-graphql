import { ApolloServer } from 'apollo-server-micro';
import Knex from 'knex';
import { Model } from 'objection';
import jsonwebtoken from 'jsonwebtoken';
import cookie from 'cookie';
import { makeSchema } from 'nexus';
import * as types from '../schema';
import connection from '../knexfile';

const knexConnection = Knex(connection[process.env.NODE_ENV]);
Model.knex(knexConnection);

const schema = makeSchema({
  types,
  outputs: false,
  shouldGenerateArtifacts: false
});

const server = new ApolloServer({
  schema,
  introspection: true,
  playground: true,
  context: async ({ req }) => {
    let user = null;

    try {
      const { jwt } = cookie.parse(req.headers.cookie);
      if (jwt) {
        user = jsonwebtoken.verify(jwt, JWTSECRET);
      }
    } catch (error) {
      // console.log('jwt error', error);
      // Token not valid
    }

    return {
      user
    };
  }
});

export const JWTSECRET = 'JWTSECRET';
export const path = '/api/graphql';
export const jwtSign = ({ id, email }) => jsonwebtoken.sign({ id, email }, JWTSECRET);

export default server.createHandler({ path });
