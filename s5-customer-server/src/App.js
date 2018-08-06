import GraphQLService from '../source/graphql-service/GraphQLService';
// import GraphQLService from 'stremo-graphql-service';

import config from './../config.json';

import localSchema from './graphql/schema';

export default () => {

    config.localSchema = localSchema;
    config.dependencies = [
        {
            serviceId: "s7-order-service",
            attribute: "Customer.orders",
            rootFieldName: "query.orders",
            schemaExtension: `
                extend type Customer {
                    orders: [Order!]
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
                        }
                    }
                }
            }
        },
        {
            serviceId: "s7-order-service",
            attribute: "Customer.shoppingcart",
            rootFieldName: "query.shoppingcart",
            schemaExtension: `
                extend type Customer {
                    shoppingcart: Shoppingcart
                }  `,
            resolvers: (schema) => {
                return {
                    Customer: {
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
        }


        // {
        //     serviceId: "s8-storage-service",
        //     attribute: "Product.places",
        //     rootFieldName: "query.places",
        //     schemaExtension: `
        //         extend type Product {
        //             places: [Place!]
        //         }  `,
        //     resolvers: (schema) => {
        //         return {
        //             Product: {
        //                 places: {
        //                     fragment: `fragment ProductFragment on Product {product_uuid}`,
        //                     resolve(parent, args, context, info) {
        //                         return info.mergeInfo.delegateToSchema({
        //                             schema,
        //                             operation: 'query',
        //                             fieldName: 'places',
        //                             args: {
        //                                 productID: parent.uuid
        //                             },
        //                             context,
        //                             info
        //                         });
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //
        // }
    ];

    let graphqlService = new GraphQLService(config);


    graphqlService.start((app) => {
        app.listen(config.instance.port)
    });
};

