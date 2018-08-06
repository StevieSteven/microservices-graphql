import fetch from 'node-fetch';
import {execute, makePromise} from 'apollo-link';
import {createHttpLink} from 'apollo-link-http';
import gql from 'graphql-tag';

/**
 * @param input
 */
const transformDependencies = (input) => {
    let dependencyArray = [];

    input.forEach(item => {
        let entry = {
            serviceId: item.serviceId,
            attribute: item.attribute,
            rootFieldName: item.rootFieldName
        };
        dependencyArray.push(entry);
    });

    return dependencyArray;
};

export default class RegistryConnection {

    constructor({host, protocol, port, servicePath}) {
        const url = `${protocol}://${host}:${port}${servicePath}`;

        console.log("RegistryManager: url: ", url);

        this.connections = []; //Connections to other (needed) services
        this.link = createHttpLink({uri: url, fetch: fetch});
    }


    /**
     * todo: adding dependencies to other services
     * @param variables
     * @returns {Promise<FetchResult>}
     */
    register(variables) {
        if(variables.dependencies) {
            variables.dependencies = transformDependencies(variables.dependencies);
        }

        const operation = {
            query: gql`
                mutation reqister($id: String!, $networkAddress: String!, $graphQLPath: String, $status: Status, $dependencies: [DependencyInput!], $version: String) {
                    register(input: {id: $id, networkAddress: $networkAddress, graphQLPath: $graphQLPath, status: $status, dependencies: $dependencies, version:$version} )
                }
            `,

            variables: variables
        };
        return makePromise(execute(this.link, operation))
    }

    deregister(id) {
        const operation = {
            query: gql`
                mutation dereqister($id: String!) {
                    deregister(id: $id)
                }
            `,

            variables: {
                id
            }
        };
        return makePromise(execute(this.link, operation))
    }

    startHeartbeat(id, heartbeatInterval, callbackFunction) {
        const operation = {
            query: gql`
                query heartbeat($id: String!) {
                    heartbeat(id: $id){
                        serviceId
                        networkAddress
                        graphQLPath
                        status
                    }
                }
            `,

            variables: {
                id
            }
        };
        const link = this.link;

        this.heartbeatInterval = setInterval(() => {
            // console.log("interval runs now ...");

            makePromise(execute(link, operation)).then(({data}) => {
                const {heartbeat} = data;

                let oldConnections = this.connections;

                this.connections = heartbeat;

                if(JSON.stringify(oldConnections) !== JSON.stringify(this.connections)) {
                    console.log("Connection haben sich geändert!");
                    callbackFunction();
                }


            }).catch(e => {
                console.log("error while heartbeat: ", JSON.stringify(e, null, 2));
            })

        }, heartbeatInterval);


    }

    /**
     * todo: testing. I think that the function won't work.
     */
    stopHeartbeat() {

        clearInterval(this.heartbeatInterval)

    }


    /**
     *
     * @returns {ApolloLink | *}
     */
    getLink() {
        return this.link;
    }


    getConnections() {
        return this.connections;
    }

    getConnection(serviceId) {
        return this.connections.filter(item => item.serviceId === serviceId)[0];
    }
}