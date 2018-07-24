import express from 'express';
import bodyParser from 'body-parser';
import {graphiqlExpress, graphqlExpress} from "apollo-server-express";

import RegistryConnection from "./src/RegistryConnection";
import generateHoleSchema from "./src/SchemaGenerator";


export default class GraphQLService {

    /**
     *
     * @param options
     * @param {GraphQLSchema} options.localSchema local GraphQL schema
     * @param {Object} options.dependencies dependencies to other services
     * @param {Object] options.instance information about local instance
     * @param {Object} options.registry information about registry connection
     */
    constructor(options = {}) {


        const defaultOptions = {
            instance: {
                status: "ONLINE"
            }
        };

        this.settings = Object.assign({}, defaultOptions, options);


        this.graphqlServer = undefined;


        this.registryConnection = new RegistryConnection(this.settings.registry);
        this.createExitHandler();
    }

    start(callbackFunction) {

        let {app, ipAddr, port, protocol, status, heartbeatInterval} = this.settings.instance;
        const {graphqlPath} = this.settings;

        status = "ONLINE";

        this.app = express();


        // this.app.use(cors());
        this.app.use(bodyParser.json());

        this.app.use("/*", (req, res, next) => {
            // console.log("method: ", req.method);
            // console.log("url: ", req.originalUrl);
            // console.log("body: ", req.body);
            next();
        });


        this.registryConnection.register({
                id: app,
                networkAddress: `${protocol}://${ipAddr}:${port}`,
                graphQLPath: graphqlPath,
                status,
                dependencies: this.settings.dependencies
            }
        ).then(data => {
            console.log("registration successfully");
            this.registryConnection.startHeartbeat(app, heartbeatInterval, () => {
                generateHoleSchema(this.settings.localSchema, this.registryConnection, this.settings.dependencies).then(schema => {
                    this.graphqlServer = graphqlExpress({
                        schema: schema,
                        formatError: error => ({
                            message: error.message,
                            state: error.originalError && error.originalError.state,
                        })
                    });
                }).catch(e => {
                    console.log("error while generating hole schema: ", e)
                });

            } );


            if (this.settings.localSchema) { //TODO creating hole schema

                generateHoleSchema(this.settings.localSchema, this.registryConnection, this.settings.dependencies).then(schema => {
                    this.graphqlServer = graphqlExpress({
                        schema: schema,
                        formatError: error => ({
                            message: error.message,
                            state: error.originalError && error.originalError.state,
                        })
                    });
                }).catch(e => {
                    console.log("error while generating hole schema: ", e)
                });


                this.app.use(this.settings.graphqlPath, (req, res, next) => {
                    this.graphqlServer(req, res, next);
                });

                if (this.settings.graphiqlEnabled) {
                    this.app.get(this.settings.graphiqlPath, graphiqlExpress({endpointURL: this.settings.graphqlPath})); // if you want GraphiQL enabled
                }
            }

            const {localSchema, dependencies} = this.settings;
            const registryConnection = this.registryConnection;
            let graphqlServer = this.graphqlServer;
            this.app.post('/reload', function (req, res) {
                generateHoleSchema(localSchema, registryConnection, dependencies).then(schema => {
                    graphqlServer = graphqlExpress({
                        schema: schema,
                        formatError: error => ({
                            message: error.message,
                            state: error.originalError && error.originalError.state,
                        })
                    });
                    res.json({
                        code: 200,
                        message: "schema changed"
                    })


                }).catch(e => {
                    console.log("error while generating hole schema: ", e);

                    res.json({
                        code: 500,
                        message: "changing schema failed"
                    })
                });


            });


            callbackFunction(this.app)


        }).catch(e => {
            console.log("registration failed: ", e);
            try {
                if (e.result)
                    console.log("result errors: ", e.result.errors)
            } catch (anotherError) {
                console.error("anotherError: ", anotherError)
            }
        });


    }


    createExitHandler() {
        process.stdin.resume();//so the program will not close instantly

        const registryConnection = this.registryConnection;
        const app = this.settings.instance.app;

        function exitHandler(options, err) {
            registryConnection.deregister(app).then(() => {
                console.log("logout  successfully. App will be finished now.");

                if (options.cleanup) console.log('clean');
                if (err) console.log(err.stack);
                if (options.exit) process.exit();
            }).catch(e => {
                console.log("logout failed: ", e);
                // console.log("result errors: ", e.result.errors)
                console.log("App will be finished now.");


                if (options.cleanup) console.log('clean');
                if (err) console.log(err.stack);
                if (options.exit) process.exit();
            });

        }

        //do something when app is closing
        process.on('exit', exitHandler.bind(null, {exit: true, cleanup: true}));

        //catches ctrl+c event
        process.on('SIGINT', exitHandler.bind(null, {exit: true}));

        // catches "kill pid" (for example: nodemon restart)
        process.on('SIGUSR1', exitHandler.bind(null, {exit: true}));
        process.on('SIGUSR2', exitHandler.bind(null, {exit: true}));

        //catches uncaught exceptions
        process.on('uncaughtException', exitHandler.bind(null, {exit: true}));
    }

}