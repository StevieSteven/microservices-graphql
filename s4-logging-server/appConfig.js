export default {
    instance: {
        app: 's4-logging-service',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        // port: 8085,
        statusPageUrl: 'http://localhost:8084/info',
        port: {
            '$': 8084,
            '@enabled': true,
        },
        vipAddress: 'logging.microservice-test.stremo.net',
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
        schema: "ms-s4-logging",
        username: "ms",
        password: "ms-development",
        queryLogging: false
    }
}