import GraphQLService from '../source/graphql-service/GraphQLService';
// import GraphQLService from 'stremo-graphql-service';

import config from './../config.json';

import localSchema from './graphql/schema';

export default () => {


    config.localSchema = localSchema;
    config.dependencies = [
        {
            serviceId: "s5-customer-service",
            attribute: "Order.address",
            rootFieldName: "query.address",
            schemaExtension: `
                 extend type Order {
                     address: Address
                 }
                 `,
            resolvers: (schema) => {
                return {
                    Order: {
                        address: {
                            fragment: `fragment OrderAddressFragment on Order {address_uuid}`,
                            resolve(parent, args, context, info) {
                                // const customerId = parent.uuid;
                                // console.log('customerId: ', customerId);
                                console.log("address id: ", parent.address_uuid);

                                return info.mergeInfo.delegateToSchema({
                                    schema: schema,
                                    operation: 'query',
                                    fieldName: 'address',
                                    args: {
                                        id: parent.address_uuid
                                    }
                                    ,
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
            serviceId: "s6-product-service",
            attribute: "OrderItem.product",
            rootFieldName: "query.product",
            schemaExtension: `
                extend type OrderItem {
                    product: Product
                }
                `,
            resolvers:
                (schema) => {
                    return {
                        OrderItem: {
                            product: {
                                fragment: `fragment ProductFragment on OrderItem {product_uuid}`,
                                resolve(parent, args, context, info) {
                                    // const customerId = parent.uuid;
                                    // console.log('customerId: ', customerId);
                                    return info.mergeInfo.delegateToSchema({
                                        schema: schema,
                                        operation: 'query',
                                        fieldName: 'product',
                                        args: {id: parent.product_uuid},
                                        context,
                                        info
                                    });
                                }
                            }
                        }
                    }
                }
        }, {
            serviceId: "s6-product-service",
            attribute: "ShoppingcartItem.product",
            rootFieldName:
                "query.product",
            schemaExtension:
                `
                extend type ShoppingcartItem {
                    product: Product
                }
                `,
            resolvers:
                (schema) => {
                    return {
                        ShoppingcartItem: {
                            product: {
                                fragment: `fragment ProductFragment on ShoppingcartItem {product_uuid}`,
                                resolve(parent, args, context, info) {
                                    // const customerId = parent.uuid;
                                    // console.log('customerId: ', customerId);
                                    return info.mergeInfo.delegateToSchema({
                                        schema,
                                        operation: 'query',
                                        fieldName: 'product',
                                        args: {
                                            id: parent.product_uuid
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
    ];


    let graphqlService = new GraphQLService(config);


    graphqlService.start((app) => {
        app.listen(config.instance.port)
    });

}
