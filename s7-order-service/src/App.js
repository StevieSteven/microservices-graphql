import express from 'express';
import Eureka from 'eureka-js-client';
import bodyParser from 'body-parser';
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express';



import schema from './graphql/schema';

import appConfig from './../appConfig';
import Logger from "./logging/Logger";

const client = new Eureka({
    instance: appConfig.instance,
    eureka: appConfig.eureka
});
// client.logger.level('debug');
client.start();

const logger = new Logger({
    eureka: client
});


const app = express();
app.use(bodyParser.json({ type: 'application/json' }));

// app.get('/', (req, res) => {
//     res.send("Response of Test;")
// });

app.use((req, res, next) => {
    // console.log("req: ", req);
    console.log("method: ", req.method);
    // console.log("body: ", req.body);
    // logger.debug({
    //     method: req.method,
    //     url: req.originalUrl,
    //     body: req.body
    // });

    req.eureka = client;
    next()
});


app.use('/graphql', bodyParser.json(), graphqlExpress({
    schema: schema,
    formatError: error => ({
        message: error.message,
        state: error.originalError && error.originalError.state,
    })
}));
app.get('/graphiql', graphiqlExpress({endpointURL: '/graphql'})); // if you want GraphiQL enabled


export default app;