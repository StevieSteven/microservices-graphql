export default {
    instance: {
        app: 's5-customer-service',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        statusPageUrl: 'http://localhost:8085/info',
        port: {
            '$': 8085,
            '@enabled': true,
        },
        vipAddress: 'customer.microservice-test.stremo.net',
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
        schema: "ms-s5-customer",
        username: "ms",
        password: "ms-development",
        queryLogging: true
    },
    logging: {
        logServerID: "s4-logging-service",
        level: "error",
        consoleLogging: true
    }
}