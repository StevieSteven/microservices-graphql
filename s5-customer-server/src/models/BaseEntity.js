let database = {};

let lastIndex = {};


/**
 * @todo Refactoring!
 */
class BaseEntity {

    constructor() {

    }

    static table() {
        if (!database[this.tableName]) {
            database[this.tableName] = []
        }

        return database[this.tableName];
    }

    static index() {
        if (!lastIndex[this.tableName]) {
            lastIndex[this.tableName] = 0;
        }
        lastIndex[this.tableName]++;
        return lastIndex[this.tableName];
    };


    static findByID(id) {

        if (this.tableName === "customers") {
            console.log("id: ", id);
            console.log("table: ", this.table())
        }
        return this.table().filter(item => item.id === id)[0];

    }

    static findByUUID(id) {

        return this.table().filter(item => item.uuid === id)[0];
    }

    static findAll(params = {}) {

        const {where, whereNot, startsWith, limit} = params;
        let result = this.table();

        if (where) {//todo: refactoring
            result = result.filter(item => {
                let sR = true;
            Object.keys(where).forEach(key => {
                if (item[key] !== where[key]) {
                sR = false;
            }
        });
            return sR;
        })
        }

        if (whereNot) { //todo: refactoring
            result = result.filter(item => {
                let sR = true;
            Object.keys(whereNot).forEach(key => {
                if (item[key] === whereNot[key]) {
                sR = false;
            }
        });
            return sR;
        })
        }

        if (startsWith) {
            result = result.filter(item => {
                let sR = true;
            Object.keys(startsWith).forEach(key => {
                if (!item[key].startsWith(startsWith[key])) {
                sR = false;
            }
        });
            return sR;
        })
        }

        if (limit) {
            return result.slice(0, limit)
        }

        return result;
    }


    static findOne(params = {}) {
        params.limit = 1;
        return this.findAll(params)[0];

    }


    static create(data = {}) {
        data.id = this.index();
        this.table().push(data);
        return data;
    }

    static updateByID(id, data) {
        let index;
        let entry = this.table().filter((entry, i) => {
            if (!index)
        index = i;
        return entry.id === id

    })[0];
        entry = Object.assign(entry, data);
        this.table()[index] = entry;

    }

    //
    // static drop(id) {
    //     if (!id)
    //         return;
    //     let query = `DELETE FROM ${this.tableName} WHERE ID= ${id}`;
    //
    //     BaseEntity.logging(query);
    //
    //     return new Promise((resolve, reject) => {
    //         conn.query(query, function (error, results, fields) {
    //             if (error) throw error;
    //             resolve(results);
    //         });
    //     });
    //
    // }
    // ;
    //
    // static dropByUUID(id) {
    //     if (!id)
    //         return;
    //     let query = `DELETE FROM ${this.tableName} WHERE uuid= "${id}"`;
    //
    //     BaseEntity.logging(query);
    //
    //     return new Promise((resolve, reject) => {
    //         conn.query(query, function (error, results, fields) {
    //             if (error) throw error;
    //             resolve(results);
    //         });
    //     });
    //
    // }
    // ;


    static count() {
        return this.table().length;
    }

    // static parseBoolean(value) {
    //     return value === true ? 1 : 0;
    //     // return !!+value;
    // }
    //
    // static logging(query) {
    //     if (loggingEnabled)
    //         console.log("query: ", query);
    // }
    //
    // static getDBString(data) {
    //     if (typeof data === "string")
    //         return `'${data}'`;
    //     return `${data} `
    // };
}

// console.log(BaseEntity.tableName,database);

export default BaseEntity;

export {
    database
}