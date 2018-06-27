import express from 'express';
import Eureka from 'eureka-js-client';
import bodyParser from 'body-parser';
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express';


import Schema from './graphql/schema';

import appConfig from './../appConfig';
import Logger from "./logging/Logger";


/**
 *
 * @param {Function} createGraphQLConfiguration
 * @returns {*|Function}
 */
export default (createGraphQLConfiguration) => {
    const client = new Eureka({
        instance: appConfig.instance,
        eureka: appConfig.eureka
    });

    const logger = new Logger({
        eureka: client
    });


    const app = express();
    app.use(bodyParser.json({type: 'application/json'}));

    /**
     * schema for hole service. can be hot reloaded.
     * @type {undefined}
     */
    let graphqlServer = undefined;
    let graphQLConfiguration = {};


// client.logger.level('debug');
    client.start(() => {

        if (createGraphQLConfiguration)
            graphQLConfiguration = createGraphQLConfiguration(client);

        Schema.generate(graphQLConfiguration).then(s => {
            graphqlServer = graphqlExpress({
                schema: s,
                formatError: error => ({
                    message: error.message,
                    state: error.originalError && error.originalError.state,
                    // locations: error.locations,
                    // path: error.path,
                })
            });
            app.use('/graphql', bodyParser.json(), (req, res, next) => {
                graphqlServer(req, res, next);
            });
        }).catch(error => {
            console.log("schema error in app: ", error);
            exit(1);
        });

        /**
         * @todo security and option handling
         */
        app.post('/reload', function (req, res) {
            Schema.generate(graphQLConfiguration).then(s => {
                graphqlServer = graphqlExpress({
                    schema: s,
                    formatError: error => ({
                        message: error.message,
                        state: error.originalError && error.originalError.state,
                        // locations: error.locations,
                        // path: error.path,
                    })
                });
                res.json({
                    code: 200,
                    message: "schema changed"
                })

            }).catch(error => {
                console.log("schema error in app: ", error);

                res.json({
                    code: 500,
                    message: "changing schema failed"
                })
            });

        });


    });


    app.get('/graphiql', graphiqlExpress({endpointURL: '/graphql'})); // if you want GraphiQL enabled

// app.get('/', (req, res) => {
//     res.send("Response of Test;")
// });

    app.use((req, res, next) => {
        // console.log("method: ", req.method);
        console.log("body: ", req.body.query);
        logger.debug({
            method: req.method,
            url: req.originalUrl,
            body: req.body
        });

        req.eureka = client;
        next()
    });

    //
    // const createGraphQLConfiguration = (client) => {
    //     return {
    //         orders: {
    //             instance: client.getInstancesByAppId("s7-order-service")[0],
    //             schemaExtension: `
    //             extend type Customer {
    //                 orders: [Order!]
    //                 shoppingcart: Shoppingcart
    //             }  `,
    //             resolvers: {
    //                 Customer: {
    //                     orders: {
    //                         fragment: `fragment OrderFragment on Customer {customer_uuid}`,
    //                         resolve(parent, args, context, info) {
    //                             const customerId = parent.uuid;
    //                             console.log('customerId: ', customerId);
    //                             return mergeInfo.delegate(
    //                                 'query',
    //                                 'orders',
    //                                 {customerID: customerId},
    //                                 context,
    //                                 info
    //                             );
    //                         }
    //                     },
    //                     shoppingcart: {
    //                         fragment: `fragment CartFragment on Customer {customer_uuid}`,
    //                         resolve(parent, args, context, info) {
    //                             const customerId = parent.uuid;
    //                             return mergeInfo.delegate(
    //                                 'query',
    //                                 'shoppingcart',
    //                                 {customerID: customerId},
    //                                 context,
    //                                 info
    //                             );
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     };
    // };

    return app;
}