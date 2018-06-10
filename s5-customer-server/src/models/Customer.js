import BaseEntity from './BaseEntity';

export default class Customer extends BaseEntity {

    static get tableName() {
        return 'customers';
    }

}