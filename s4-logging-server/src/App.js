import express from 'express';
import bodyParser from 'body-parser';
import Eureka from 'eureka-js-client';

import appConfig from './../appConfig';

import LoggingResource from './resources/LoggingResource';

// example configuration
const client = new Eureka({
    // application instance information
    instance: appConfig.instance,
    eureka: appConfig.eureka
});
// client.logger.level('debug');
client.start();


const app = express();
app.use(bodyParser.json({type: 'application/json'}));


//
// app.get('/test', (req, res) => {
//     res.send("Response of Test;")
// });
//

app.use((req, res, next) => {
    console.log("url: ", req.method + req.originalUrl);
    // console.log("body: ", req.body);
    req.eureka = client;
    next()
});

//
// app.get("/orders", (req, res) => {
//
//     let instances = client.getInstancesByAppId("s7-order-service");
//     console.log("instances: ", instances);
//     console.log("instances: homePageURL: ", instances[0].homePageUrl);
//
//     res.json(instances);
//
// });

app.get('/', (req, res) => {
    let links = {
        _links: {
            self: {
                href: '/'
            }     ,
            logs: {
                href: '/logs'
            }
        }
    };

   res.json(links)

});

app.use('/logs', LoggingResource);





export default app;