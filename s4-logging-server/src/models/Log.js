import BaseEntity from './BaseEntity';

export default class Log extends BaseEntity {

    static get tableName() {
        return 'logs';
    }

}