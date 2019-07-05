import Knex from 'knex';
import { Model } from 'objection';
import connection from '../../knexfile';

const knexConnection = Knex(connection[process.env.NODE_ENV]);
Model.knex(knexConnection);

let afterDone;

beforeEach(done => {
  knexConnection
    .transaction(newtrx => {
      Model.knex(newtrx);
      done();
    })
    .catch(() => {
      afterDone();
    });
});

afterEach(done => {
  afterDone = done;
  Model.knex().rollback();
});
