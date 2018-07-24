import GraphQLService from '../source/graphql-service/GraphQLService';
// import GraphQLService from 'stremo-graphql-service';

import config from './../config.json';

import localSchema from './graphql/schema';

export default () => {

    config.localSchema = localSchema;
    config.dependencies = [
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