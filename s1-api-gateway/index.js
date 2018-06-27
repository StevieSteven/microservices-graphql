// import App from './src/App';
// import appConfig from './appConfig';
//
// App.listen(appConfig.instance.port['$'], () => {
//     console.log(`${appConfig.instance.app} started at port ${appConfig.instance.port['$']} `)
// });

import {graphqlExpress, graphiqlExpress} from 'apollo-server-express';
import express from 'express';
import bodyParser from 'body-parser';
import {makeRemoteExecutableSchema, mergeSchemas, introspectSchema} from 'graphql-tools';
import {createApolloFetch,} from 'apollo-fetch';

async function run() {
    const createRemoteSchema = async (uri) => {
        const fetcher = createApolloFetch({uri});
        return makeRemoteExecutableSchema({
            schema: await introspectSchema(fetcher),
            fetcher
        });
    };
    const productSchema = await createRemoteSchema('http://localhost:8085/graphql');
    const delivererSchema = await createRemoteSchema('http://localhost:8087/graphql');
    const linkSchemaDefs = `

    
    extend type Order {
        address: Address!
    }
  `;
    const schema = mergeSchemas({
        schemas: [productSchema, delivererSchema],
        resolvers: mergeInfo => ({
            // Customer: {
            //     orders: {
            //         fragment: `fragment CustomerOrderFragment on Customer {uuid}`,
            //         resolve(parent, args, context, info) {
            //             const customerId = parent.uuid;
            //             console.log('customerId: ', customerId);
            //             return mergeInfo.delegate(
            //                 'query',
            //                 'orders',
            //                 {customerID: customerId},
            //                 context,
            //                 info
            //             );
            //         }
            //     }
            // },
            //
            // Order: {
            //     address: {
            //         fragment: `fragment OrderAddressFragment on Order {address_uuid}`,
            //         resolve(parent, args, context, info) {
            //             const address_uuid = parent.address_uuid;
            //             console.log('address_uuid: ', address_uuid);
            //             return mergeInfo.delegate(
            //                 'query',
            //                 'address',
            //                 {id: address_uuid},
            //                 context,
            //                 info
            //             );
            //         }
            //     }
            // },
        })
    });

    const app = express();

    app.use(bodyParser.json({type: 'application/json'}));
    app.use((req, res, next) => {
        // console.log("method: ", req.method);
        console.log("body: ", req.body);

        console.log("remoteAddress", req.connection.remoteAddress);


        next()
    });
    app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));

    app.use(
        '/graphiql',
        graphiqlExpress({
            endpointURL: '/graphql',

        })
    );

    app.listen(8080);
    console.log('Server running. Open http://localhost:8080/graphiql to run queries.');
}

try {
    run();
} catch (e) {
    console.log(e, e.message, e.stack);
}