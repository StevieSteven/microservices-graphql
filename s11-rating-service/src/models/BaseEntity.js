/**
 * last time modified: 03.06.2018
 */
import conn from '../database/connection';

import settings from '../../appConfig';

const loggingEnabled = settings.database.queryLogging === true;

/**
 * @todo Refactoring!
 */
class BaseEntity {

    constructor() {

    }

    static findById(id) {

        let query = `SELECT * FROM ${this.tableName} WHERE id= "${id}";`;
        BaseEntity.logging(query);
        return new Promise((resolve, reject) => {
            conn.query(query, function (error, results, fields) {
                if (error) throw error;
                resolve(results[0]);
            });
        });
    }

    static findByUUID(id) {

        let query = `SELECT * FROM ${this.tableName} WHERE uuid= "${id}";`;
        BaseEntity.logging(query);
        return new Promise((resolve, reject) => {
            conn.query(query, function (error, results, fields) {
                if (error) throw error;
                resolve(results[0]);
            });
        });
    }

    static findAll(params) {
        // let me = this;
        let query = 'SELECT * FROM ' + this.tableName;
        if (params && params.where) {
            let whereStrings = [];
            for (let key in params.where) {
                whereStrings.push(` ${key} = '${params.where[key]}' `);
            }
            if (whereStrings.length > 0) {
                query += ' WHERE ';
                for (let index = 0; index < whereStrings.length - 1; index++) {
                    query += whereStrings[index] + " AND ";
                }
                query += whereStrings[whereStrings.length - 1];
            }
        }
        if (params && params.limit) {
            query += ' LIMIT ' + params.limit;
        }

        query += ';';

        BaseEntity.logging(query);


        return new Promise((resolve, reject) => {
            conn.query(query, function (error, results, fields) {
                if (error) throw error;
                if (params && params.limit === 1) {
                    // console.log("filter nur ein Element: ", results);
                    resolve(results[0]);
                }
                resolve(results);
            });
        });
    }


    static findOne(params) {
        if (!params)
            params = {};
        params.limit = 1;
        return this.findAll(params);

    }


    static create(data) {


        let me = this;
        if (!data)
            return;
        let keys = [];
        let values = [];
        for (let key in data) {
            keys.push(key);
            values.push(data[key]);
        }
        if (!keys.length === 0)
            return;
        let query = `INSERT INTO ${this.tableName} (`;
        for (let keyIndex = 0; keyIndex < keys.length - 1; keyIndex++)
            query += `${keys[keyIndex]}, `
        query += `${keys[keys.length - 1]}) VALUES (`;
        for (let keyIndex = 0; keyIndex < keys.length - 1; keyIndex++) {
            let data = values[keyIndex];

            query += `${this.getDBString(data)}, `

        }
        query += `${this.getDBString(values[keys.length - 1])});`;

        BaseEntity.logging(query);

        return new Promise((resolve, reject) => {
            conn.query(query, function (error, results, fields) {
                if (error) {
                    throw error;
                    // reject(error);

                }

                resolve(me.findById(results.insertId));

            });


        });
    }

    static updateByUUID(id, data) {
        if (!id || !data) return;
        let query = `UPDATE ${this.tableName} SET `;

        let pairs = [];
        for (let key in data)
            pairs.push(`${key} = ${ this.getDBString(data[key])}`);
        query += pairs.join(', ');

        query += ` WHERE uuid = "${id}" ;`;

        console.log("pairs: ", pairs);
        BaseEntity.logging(query);
        return new Promise((resolve, reject) => {
            conn.query(query, function (error, results, fields) {
                if (error) throw error;
                resolve(results);
            });
        });
    }

    static drop(id) {
        if (!id)
            return;
        let query = `DELETE FROM ${this.tableName} WHERE ID= ${id}`;

        BaseEntity.logging(query);

        return new Promise((resolve, reject) => {
            conn.query(query, function (error, results, fields) {
                if (error) throw error;
                resolve(results);
            });
        });

    };


    static dropAll() {
        let query = `DELETE FROM ${this.tableName}`;

        BaseEntity.logging(query);

        return new Promise((resolve, reject) => {
            conn.query(query, function (error, results, fields) {
                if (error) throw error;
                resolve(results);
            });
        });

    }
    ;


    static dropByUUID(id) {
        if (!id)
            return;
        let query = `DELETE FROM ${this.tableName} WHERE uuid= "${id}"`;

        BaseEntity.logging(query);

        return new Promise((resolve, reject) => {
            conn.query(query, function (error, results, fields) {
                if (error) throw error;
                resolve(results);
            });
        });

    }
    ;


    static raw(query) {
        BaseEntity.logging(query);

        return new Promise((resolve, reject) => {
            conn.query(query, function (error, results, fields) {
                if (error) throw error;
                resolve(results);
            });
        });
    }


    static count() {
        let query = `SELECT COUNT(*) FROM ${this.tableName};`;

        BaseEntity.logging(query);

        return new Promise((resolve, reject) => {
            conn.query(query, function (error, results, fields) {
                if (error) throw error;
                resolve(results);
            });
        });
    }

    static parseBoolean(value) {
        return value === true ? 1 : 0;
        // return !!+value;
    }

    static logging(query) {
        if (loggingEnabled)
            console.log("query: ", query);
    }

    static getDBString(data) {
        if (typeof data === "string")
            return `'${data}'`;
        return `${data} `
    };
}

export default BaseEntity;