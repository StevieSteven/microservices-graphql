import fs from 'fs';
import {
    makeExecutableSchema
} from 'graphql-tools';

import resolvers from './resolvers';

const typeDefs = [fs.readFileSync('./src/graphql/schema.graphqls', 'utf8')];

const localSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

export default localSchema


