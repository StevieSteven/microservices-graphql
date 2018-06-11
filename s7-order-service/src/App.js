// import express from 'express';
// import Eureka from 'eureka-js-client';
// import bodyParser from 'body-parser';
// import {graphqlExpress, graphiqlExpress} from 'apollo-server-express';
//
//
//
// import schema from './graphql/schema';
//
// import appConfig from './../appConfig';
// import Logger from "./logging/Logger";
//
// const client = new Eureka({
//     instance: appConfig.instance,
//     eureka: appConfig.eureka
// });
// // client.logger.level('debug');
// client.start();
//
// const logger = new Logger({
//     eureka: client
// });
//
//
// const app = express();
// app.use(bodyParser.json({ type: 'application/json' }));
//
// // app.get('/', (req, res) => {
// //     res.send("Response of Test;")
// // });
//
// app.use((req, res, next) => {
//     // console.log("req: ", req);
//     console.log("method: ", req.method);
//     // console.log("body: ", req.body);
//     // logger.debug({
//     //     method: req.method,
//     //     url: req.originalUrl,
//     //     body: req.body
//     // });
//
//     req.eureka = client;
//     next()
// });
//
//
// app.use('/graphql', bodyParser.json(), graphqlExpress({
//     schema: schema,
//     formatError: error => ({
//         message: error.message,
//         state: error.originalError && error.originalError.state,
//     })
// }));
// app.get('/graphiql', graphiqlExpress({endpointURL: '/graphql'})); // if you want GraphiQL enabled
//
//
// export default app;


import GraphQLApp from './GraphQLApp';

const createGraphQLConfiguration = (client) => {
    return {
        // address: {
        //     instance: client.getInstancesByAppId("s5-customer-service")[0],
        //     schemaExtension: `
        //         extend type Order {
        //             address: Address
        //         }
        //                         `,
        //     resolvers: {
        //         Order: {
        //             address: {
        //                 fragment: `fragment AddressFragment on Order {address_uuid}`,
        //                 resolve(parent, args, context, info) {
        //                     // const customerId = parent.uuid;
        //                     // console.log('customerId: ', customerId);
        //                     return info.mergeInfo.delegate(
        //                         'query',
        //                         'address',
        //                         {id: parent.address_uuid},
        //                         context,
        //                         info
        //                     );
        //                 }
        //             }
        //         }
        //     }
        // },
        products: {
            instance: client.getInstancesByAppId("s6-product-service")[0],
            schemaExtension: `
                
            
                extend type OrderItem {
                    product: Product
                }  
                
                extend type ShoppingcartItem {
                    product: Product
                }
                `,
            resolvers: {
                OrderItem: {
                    product: {
                        fragment: `fragment ProductFragment on OrderItem {product_uuid}`,
                        resolve(parent, args, context, info) {
                            // const customerId = parent.uuid;
                            // console.log('customerId: ', customerId);
                            return info.mergeInfo.delegate(
                                'query',
                                'product',
                                {id: parent.product_uuid},
                                context,
                                info
                            );
                        }
                    }
                },
                ShoppingcartItem: {
                    product: {
                        fragment: `fragment ProductFragment on ShoppingcartItem {product_uuid}`,
                        resolve(parent, args, context, info) {
                            // const customerId = parent.uuid;
                            // console.log('customerId: ', customerId);
                            return info.mergeInfo.delegate(
                                'query',
                                'product',
                                {id: parent.product_uuid},
                                context,
                                info
                            );
                        }
                    }
                }
            }
        }
    };
};
//
//
export default GraphQLApp(createGraphQLConfiguration);