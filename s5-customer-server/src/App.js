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
                resolvers: {
                    Customer: {
                        orders: {
                            fragment: `fragment OrderFragment on Customer {customer_uuid}`,
                            resolve(parent, args, context, info) {
                                const customerId = parent.uuid;
                                console.log('customerId: ', customerId);
                                return info.mergeInfo.delegate(
                                    'query',
                                    'orders',
                                    {customerID: customerId},
                                    context,
                                    info
                                );
                            }
                        },
                        shoppingcart: {
                            fragment: `fragment CartFragment on Customer {customer_uuid}`,
                            resolve(parent, args, context, info) {
                                const customerId = parent.uuid;
                                return info.mergeInfo.delegate(
                                    'query',
                                    'shoppingcart',
                                    {customerID: customerId},
                                    context,
                                    info
                                );
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