import GraphQLApp from './GraphQLApp';

/**
 *
 * @param client eureka client
 * @returns {*}
 */
const createGraphQLConfiguration = (client) => {
    return {
        places: {
            instance: client.getInstancesByAppId("s8-storage-service")[0],
            schemaExtension: `
                extend type Product {
                    places: [Place!]
                }  `,
            resolvers: (schema) => {
                return {
                    Product: {
                        places: {
                            fragment: `fragment ProductFragment on Product {uuid}`,
                            resolve(parent, args, context, info) {
                                return info.mergeInfo.delegateToSchema({
                                    schema,
                                    operation: 'query',
                                    fieldName: 'places',
                                    args: {
                                        productID: parent.uuid
                                    },
                                    context,
                                    info
                                });
                            }
                        }
                    }
                }
            }
        },
        ratings: {
            instance: client.getInstancesByAppId("s11-rating-service")[0],
            schemaExtension: `
                extend type Product {
                    ratings: [Rating!]
                }  `,
            resolvers: (schema) => {
                return {
                    Product: {
                        ratings: {
                            fragment: `fragment RatingFragment on Product {uuid}`,
                            resolve(parent, args, context, info) {
                                return info.mergeInfo.delegateToSchema({
                                    schema,
                                    operation: 'query',
                                    fieldName: 'ratingsOfProduct',
                                    args: {
                                        productID: parent.uuid
                                    },
                                    context,
                                    info
                                });
                            }
                        }
                    }
                }
            }
        }
    };
};
export default GraphQLApp(createGraphQLConfiguration);