export default {
    instance: {
        app: 's11-rating-service',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        // port: 8085,
        statusPageUrl: 'http://localhost:8091/info',
        port: {
            '$': 8091,
            '@enabled': true,
        },
        vipAddress: 'orders.microservice-test.stremo.net',
        // dataCenterInfo: {
        //     name: 'MyOwn',
        // },
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        // eureka server host / port
        host: '127.0.0.1',
        // host: '192.168.178.20',
        port: 8761,
        servicePath: '/eureka/apps/',
        preferIpAddress: true
    },
    database: {
        host: "localhost",
        schema: "ms-s11-ratings",
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