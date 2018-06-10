export default {
    instance: {
        app: 's1-api-gateway',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        statusPageUrl: 'http://localhost:8080/info',
        port: {
            '$': 8080,
            '@enabled': true,
        },
        vipAddress: 'api-gateway.microservice-test.stremo.net',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        // eureka server host / port
        host: '127.0.0.1',
        port: 8761,
        servicePath: '/eureka/apps/',
        preferIpAddress: true
    },
    database: {
        host: "localhost",
        schema: "ms-s1-api-gateway",
        username: "ms",
        password: "ms-development",
        queryLogging: false
    },

    logging: {
        logServerID: "s4-logging-service",
        level: "warn",
        consoleLogging: true
    }
}