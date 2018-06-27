import fs from 'fs';
import {
    makeExecutableSchema,
    makeRemoteExecutableSchema,
    mergeSchemas,
    introspectSchema,
    FilterRootFields
} from 'graphql-tools';
import {createApolloFetch} from 'apollo-fetch';

import resolvers from './resolvers';

const typeDefs = [fs.readFileSync('./src/graphql/schema.graphqls', 'utf8')];

const localSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
});


const getUrl = (instance) => {
    if (!instance)
        return;

    return `http://${instance.ipAddr}:${instance.port["$"]}/graphql`
};

export default class Schema {

    static generate(props) {
        return run(props)
    }
}

async function run(props = {}) {
    let schemas = [localSchema];
    let mergeResolvers = {};

    const createRemoteSchema = async (uri) => {
        const fetcher = createApolloFetch({uri});
        return makeRemoteExecutableSchema({
            schema: await introspectSchema(fetcher),
            fetcher
        });
    };

    for (let key of Object.keys(props)) {

        let {instance, schemaExtension, resolvers, filter} = props[key];

        let url = getUrl(instance);
        if (!url) {
            console.error(`no url for ${key} found`);
            continue;
        }


        let orderSchema = undefined;
        try {
            orderSchema = await createRemoteSchema(url);

            // console.log("filter: ", filter);
            if (filter && filter.transformSchema)
                orderSchema = filter.transformSchema(orderSchema);

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

        mergeResolvers = Object.assign(mergeResolvers, resolvers(orderSchema));
    }


    let globalFilter = new FilterRootFields((operation, fieldName, field) => {
        console.log("operation: ", operation);
        // console.log("field: ", field);
        // if (operation === "Mutation") return false;


        // console.log("wichtiges fieldName: ", fieldName);

        return fieldName !== "address";

        // return true;

    });

    return globalFilter.transformSchema(mergeSchemas({ //produces an console warn: The addResolveFunctionsToSchema function takes named options now; see IAddResolveFunctionsToSchemaOptions
        schemas: schemas,
        resolvers: mergeResolvers
    }));
}

