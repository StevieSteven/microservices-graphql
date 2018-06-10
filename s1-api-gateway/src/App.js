import express from 'express';
import Eureka from 'eureka-js-client';
import bodyParser from 'body-parser';
// import request from 'request-promise-native';
import request from 'request';

import Logger from './logging/Logger';
import appConfig from './../appConfig';

const client = new Eureka({
    instance: appConfig.instance,
    eureka: appConfig.eureka
});

// client.logger.level('debug');
client.start();

const app = express();
app.use(bodyParser.json({type: 'application/json'}));

const logger = new Logger({
    eureka: client
});

// process.on('uncaughtException', (err) => {
//    logger.error({
//        uncaughtException: err
//    })
// });


const SERVICES = {
    logging: {
        serviceID: 's4-logging-service',
        internalPath: "logs"
    },
    customers: {
        serviceID: 's5-customer-service',
        internalPath: ""
    },
    // products: {
    //     serviceID: 's6-product-service',
    //     internalPath: 'products'
    // },
    categories: {
        serviceID: 's6-product-service',
        internalPath: 'categories'
    },
    // orders: {
    //     serviceID: 's7-order-service',
    //     internalPath: 'orders'
    // },
    // storage: {
    //     serviceID: 's8-storage-service',
    //     internalPath: 'storage'
    // }
};

const isJson = (text) => {
    if (typeof text === 'object')
        return true;
    if (Array.isArray(text))
        return true;

    return /^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))
};

const getServiceSpecificUri = (pathArray) => {
    pathArray.splice(0, 2);
    return pathArray.join("/")
};


const getLinks = (req) => {
    let url = req.protocol + '://' + req.get('host') || "";

    let links = {
        self: {
            href: url + '/'
        }
    };

    Object.keys(SERVICES).forEach(key => {
        links[key] = {
            href: `${url}/${key}`
        }
    });
    return links;
};

app.get("/", (req, res) => {
    res.json({_links: getLinks(req)});
});

app.use(async (req, res) => {
    let path = req.originalUrl.split('/');

    let service = SERVICES[path[1]];

    if (!service) {
        res.status(404);
        res.json({
            success: false,
            message: "no service for resource available",
            _links: getLinks(req)
        });
        return;
    }


    let instance = client.getInstancesByAppId(service.serviceID)[0];

    if (!instance) {
        res.status(500);
        res.json({
            error: "service offline",
            _links: getLinks(req)
        });
        return;
    }

    let baseUrl = `${req.protocol}://${instance.ipAddr}:${instance.port['$']}/`;

    if (service.internalPath && service.internalPath.length > 0) {
        baseUrl += `${service.internalPath}/`
    }
    baseUrl += getServiceSpecificUri(path);

    let url = baseUrl;
    // let url = `http://${instance.ipAddr}:${instance.port['$']}/${service.internalPath}/${getServiceSpecificUri(path)}`;

    // const user = JSON.parse(await request(url));

    // console.log("method: ", req.method);
    // console.log("body: ", req.body);

    logger.debug({
        method: req.method,
        url: req.originalUrl,
        body: req.body
    });

    request({
        method: req.method || "GET",
        uri: url,
        json: req.body
    }, function (error, response, body) {
        // body is the decompressed response body
        // console.log("normal error: ", error);
        // console.log("response: ", response.statusCode);
        //
        // console.log('server encoded the data as: ', (response.headers['content-encoding'] || 'identity'))
        // console.log('the decoded data is: ', body);
        if (error) {
            console.log("normal error: ", error);
            console.log("response: ", response);

            res.status(500);
            res.send(body);
        }


        res.status(response.statusCode);
        if (!isJson(body)) {
            res.send(body);
            return;
        }
        if (typeof body === 'object' || Array.isArray(body)) {
            res.json(body);
            return;
        }
        res.json(JSON.parse(body));
    })

});

export default app;