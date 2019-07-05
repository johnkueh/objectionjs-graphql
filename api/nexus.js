import { makeSchema } from 'nexus';
import * as types from './schema';
import { join } from 'path';

const schema = makeSchema({
  types,
  outputs: {
    schema: join(__dirname, './generated/schema.graphql'),
    typegen: join(__dirname, './generated/types.d.ts')
  }
});

console.log('Generated Nexus Schema');
