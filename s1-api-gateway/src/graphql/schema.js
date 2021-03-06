import fs from 'fs';
import {makeExecutableSchema, makeRemoteExecutableSchema, mergeSchemas, introspectSchema} from 'graphql-tools';
import {createApolloFetch} from 'apollo-fetch';

import resolvers from './resolvers';

const typeDefs = [fs.readFileSync('./src/graphql/schema.graphqls', 'utf8')];

let localSchema = undefined;

try {
    localSchema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });

} catch (error) {
    console.error("error while creating local schema")
}


const getUrl = (instance) => {
    if(!instance)
        return;

    return `http://${instance.ipAddr}:${instance.port["$"]}/graphql`
};

export default class Schema {

    static generate(props) {
        return run(props)
    }
}

async function run(props = {}) {
    let schemas = [];
    let mergeResolvers = {};

    if(localSchema)
        schemas.push(localSchema);

    const createRemoteSchema = async (uri) => {
        const fetcher = createApolloFetch({uri});
        return makeRemoteExecutableSchema({
            schema: await introspectSchema(fetcher),
            fetcher
        });
    };

    for (let key of Object.keys(props)) {

        let {instance, schemaExtension, resolvers} = props[key];

        let url = getUrl(instance);
        if (!url) {
            console.error(`no url for ${key} found`);
            continue;
        }
        let orderSchema = undefined;
        try {
            orderSchema = await createRemoteSchema(url);

        } catch (e) {
            console.error(`${key}: no schema on ${url} available`);
            continue;

        }
        if (!orderSchema) {
            console.error("no schema on " + url + " available");
            continue;
        }

        schemas.push(orderSchema);
        schemas.push(schemaExtension);

        mergeResolvers = Object.assign(mergeResolvers, resolvers);
    }

    return mergeSchemas({ //produces an console warn: The addResolveFunctionsToSchema function takes named options now; see IAddResolveFunctionsToSchemaOptions
        schemas: schemas,
        resolvers: mergeResolvers
    });
}

