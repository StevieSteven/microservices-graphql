import express from 'express';
import Eureka from 'eureka-js-client';
import bodyParser from 'body-parser';
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express';


import schema from './graphql/schema';


/**
 *
 * @param {Function} createGraphQLConfiguration
 * @returns {*|Function}
 */
export default (createGraphQLConfiguration) => {
    // const client = new Eureka({
    //     instance: appConfig.instance,
    //     eureka: appConfig.eureka
    // });

    // const logger = new Logger({
    //     eureka: client
    // });


    const app = express();
    app.use(bodyParser.json({type: 'application/json'}));

    /**
     * schema for hole service. can be hot reloaded.
     * @type {undefined}
     */
    let graphqlServer = undefined;
    let graphQLConfiguration = {};


// client.logger.level('debug');
//     client.start(() => {

    // if (createGraphQLConfiguration)
    //     graphQLConfiguration = createGraphQLConfiguration(client);
    //
    // Schema.generate(graphQLConfiguration).then(s => {
    //     graphqlServer = graphqlExpress({
    //         schema: s,
    //         formatError: error => ({
    //             message: error.message,
    //             state: error.originalError && error.originalError.state,
    //             // locations: error.locations,
    //             // path: error.path,
    //         })
    //     });
    //     app.use('/graphql', bodyParser.json(), (req, res, next) => {
    //         graphqlServer(req, res, next);
    //     });
    // }).catch(error => {
    //     console.log("schema error in app: ", error);
    //     exit(1);
    // });

    app.use('/graphql', bodyParser.json(), graphqlExpress({
        schema: schema,
        formatError: error => ({
            message: error.message,
            state: error.originalError && error.originalError.state,
            // locations: error.locations,
            // path: error.path,
        })
    })
    );
    // });


    app.get('/graphiql', graphiqlExpress({endpointURL: '/graphql'})); // if you want GraphiQL enabled

    // app.use((req, res, next) => {
    //     // console.log("method: ", req.method);
    //     console.log("body: ", req.body.query);
    //     logger.debug({
    //         method: req.method,
    //         url: req.originalUrl,
    //         body: req.body
    //     });
    //
    //     req.eureka = client;
    //     next()
    // });
    //

    return app;
}