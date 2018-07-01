import GraphQLApp from './GraphQLApp';

const createGraphQLConfiguration = (client) => {
    // return (mergeInfo) => {
    return {
        orders: {
            instance: client.getInstancesByAppId("s7-order-service")[0],
            schemaExtension: `
                extend type Customer {
                    orders: [Order!]
                    shoppingcart: Shoppingcart
                }  `,
            resolvers: (schema) => {
                return {
                    Customer: {
                        orders: {
                            fragment: `fragment OrderFragment on Customer {customer_uuid}`,
                            resolve(parent, args, context, info) {
                                const customerId = parent.uuid;
                                console.log('customerId: ', customerId);
                                return info.mergeInfo.delegateToSchema({
                                    schema,
                                    operation: 'query',
                                    fieldName: 'orders',
                                    args: {
                                        customerID: customerId
                                    },
                                    context,
                                    info
                                });
                            }
                        },
                        shoppingcart: {
                            fragment: `fragment CartFragment on Customer {customer_uuid}`,
                            resolve(parent, args, context, info) {
                                const customerId = parent.uuid;
                                return info.mergeInfo.delegateToSchema({
                                    schema,
                                    operation: 'query',
                                    fieldName: 'shoppingcart',
                                    args: {
                                        customerID: customerId
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
                extend type Customer {
                    ratings: [Rating!]
                }  `,
            resolvers: (schema) => {
                return {
                    Customer: {
                        ratings: {
                            fragment: `fragment RatingFragment on Customer {uuid}`,
                            resolve(parent, args, context, info) {
                                const customerId = parent.uuid;
                                console.log('customerId: ', customerId);
                                return info.mergeInfo.delegateToSchema({
                                    schema,
                                    operation: 'query',
                                    fieldName: 'ratingsOfCustomer',
                                    args: {
                                        customerID: customerId
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
        // };
    };
};
//
//
export default GraphQLApp(createGraphQLConfiguration);