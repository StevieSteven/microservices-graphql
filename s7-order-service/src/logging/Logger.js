import request from 'request';

import appConfig from './../../config';


const LEVELS = ["debug", "info", "warn", "error"];

export default class Logger {

    constructor(options = {}) {
        this.level = options.level || appConfig.logging.level || "info";
        this.serverAddress = options.serverAddress;
        this.eureka = options.eureka;
        this.serviceID = options.serviceID || appConfig.instance.app;
        this.consoleLogging = options.consoleLogging || appConfig.consoleLogging


    }


    log(message, level = "info") {
        if (LEVELS.indexOf(level) < LEVELS.indexOf(this.level))
            return;

        if (!message)
            return;


        let data = {
            timestamp: new Date().toLocaleString(),
            serviceID: this.serviceID,
            level: level,
            message: JSON.stringify(message)
        };

        if (this.consoleLogging)
            console.log(`${level}: `, data);

        let url = this.serverAddress;

        if (!url) {
            let instance = this.eureka.getInstancesByAppId(appConfig.logging.logServerID)[0];

            if (instance) {
                url = `http://${instance.ipAddr}:${instance.port['$']}`
            }
        }

        if (!url) {
            console.error("Can't get the URL of logging service");
            return;
        }

        request({
            method: "POST",
            uri: `${url}/logs`,
            json: data
        }, function (error, response) {

            if (error) {
                console.log("normal error: ", error);
                console.log("response: ", response);
            }

        })

    }

    info(message) {
        this.log(message, "info");
    }

    debug(message) {
        this.log(message, "debug");
    }

    warn(message) {
        this.log(message, "warn");
    }


    error(message) {
        this.log(message, "error");
    }


}

