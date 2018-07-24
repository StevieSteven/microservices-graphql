import {
    makeRemoteExecutableSchema,
    mergeSchemas,
    introspectSchema,
    FilterRootFields
} from 'graphql-tools';
import {createApolloFetch} from 'apollo-fetch';


const createRemoteSchema = async (uri) => {
    const fetcher = createApolloFetch({uri});
    return makeRemoteExecutableSchema({
        schema: await introspectSchema(fetcher),
        fetcher
    });
};



/**
 *
 * @param {GraphQLSchema} localSchema
 * @param {RegistryConnection} registryConnection
 * @param {Object} dependencies
 */
async function generateHoleSchema (localSchema, registryConnection, dependencies) {


    console.log("generateHoleSchema");
    console.log("dependencies: ", dependencies);

    return new Promise((resolve, reject) => {
        //TODO
        if (!localSchema) {
            reject("no local schema existing")
        }


        if (!dependencies || dependencies.length === 0)
            resolve(localSchema);

        //TODO start of refactoring

        resolve(run(localSchema, registryConnection, dependencies));

    })
};


export default generateHoleSchema;


/*
old but gold:

 */

const getUrl = (instance) => {

    if (!instance)
        return;

    return `${instance.networkAddress}${instance.graphQLPath}`
};


async function run(localSchema, registryConnection, dependencies) {
    let schemas = [localSchema];
    let mergeResolvers = {};

    for (let item of dependencies) {


        let key = item.instance;

        let {schemaExtension, resolvers, filter} = item;

        let url = getUrl(registryConnection.getConnection(item.serviceId));
        if (!url) {
            console.error(`no url for ${key} found`);
            continue;
        }

        console.log(url);


        let newSchema = undefined;
        try {
            newSchema = await createRemoteSchema(url);

            // console.log("filter: ", filter);
            if (filter && filter.transformSchema)
                newSchema = filter.transformSchema(newSchema);

        } catch (e) {
            console.error(`${key}: no schema on ${url} available`);
            continue;

        }
        if (!newSchema) {
            console.error("no schema on " + url + " available");
            continue;
        }

        schemas.push(newSchema);
        schemas.push(schemaExtension);

        mergeResolvers = Object.assign(mergeResolvers, resolvers(newSchema));
    }


    let globalFilter = new FilterRootFields((operation, fieldName, field) => {
        console.log("operation: ", operation);
        // console.log("field: ", field);
        // if (operation === "Mutation") return false;


        // console.log("wichtiges fieldName: ", fieldName);

        return fieldName !== "address";

        // return true;

    });

    let holeSchema = localSchema;

    try {
        holeSchema =globalFilter.transformSchema(mergeSchemas({ //produces an console warn: The addResolveFunctionsToSchema function takes named options now; see IAddResolveFunctionsToSchemaOptions
            schemas: schemas,
            resolvers: mergeResolvers
        }));
    } catch (e) {
    }
    return holeSchema;
}

