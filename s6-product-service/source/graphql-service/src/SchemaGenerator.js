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
    // console.log("dependencies: ", dependencies);

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

    let blackListOfPublicFilter = [];

    for (let item of dependencies) {


        let key = item.serviceId;

        let {schemaExtension, resolvers, filter} = item;

        let url = getUrl(registryConnection.getConnection(item.serviceId));
        if (!url) {
            console.error(`no url for ${key} found`);
            continue;
        }

        console.log(url);


        let remoteSchema = undefined;
        try {
            remoteSchema = await createRemoteSchema(url);

            if (filter && filter.transformSchema)
                remoteSchema = filter.transformSchema(remoteSchema);

        } catch (e) {
            console.error(`${key}: no schema on ${url} available`);
            continue;

        }
        if (!remoteSchema) {
            console.error(`no schema on ${url} available`);
            continue;
        }

        /**
         * main job of the filter is delete all remote filter
         * @type {FilterRootFields}
         */
        let singleSchemaFilter = new FilterRootFields((operation, fieldName, field) => {

            for(let dependency of dependencies) {
                let rootFieldName = dependency.rootFieldName;

                let rootFieldList = rootFieldName.split(".");
                let operationNamePart = rootFieldList[0];
                let fieldNamePart = rootFieldList[1];

                if(operation.toLowerCase() === operationNamePart.toLowerCase() && fieldName === fieldNamePart) {
                    blackListOfPublicFilter.push(rootFieldName);
                    return true;
                }
            }
            return false;
        });


        remoteSchema = singleSchemaFilter.transformSchema(remoteSchema);

        schemas.push(remoteSchema);
        schemas.push(schemaExtension);

        mergeResolvers = Object.assign(mergeResolvers, resolvers(remoteSchema));
    }


    /**
     * main job of the filter is delete all remote filter
     * @type {FilterRootFields}
     */
    let publicSchemaFilter = new FilterRootFields((operation, fieldName, field) => {
        for(let item of blackListOfPublicFilter) {
            let rootFieldList = item.split(".");
            let operationNamePart = rootFieldList[0];
            let fieldNamePart = rootFieldList[1];

            if(operation.toLowerCase() === operationNamePart.toLowerCase() && fieldName === fieldNamePart) {
                return false;
            }
        }

        return true;

    });

    let privateSchema = localSchema;

    try {
        privateSchema =mergeSchemas({ //produces an console warn: The addResolveFunctionsToSchema function takes named options now; see IAddResolveFunctionsToSchemaOptions
            schemas: schemas,
            resolvers: mergeResolvers
        });
    } catch (e) {
    }


    let publicSchema = privateSchema;

    try {
        publicSchema = publicSchemaFilter.transformSchema(privateSchema);
    } catch(e) {
        console.log.error("error while forming publicSchema")
    }


    return publicSchema;



}

