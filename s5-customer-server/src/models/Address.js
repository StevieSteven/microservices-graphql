import BaseEntity from './BaseEntity';

export default class Address extends BaseEntity {

    static get tableName() {
        return 'addresses';
    }

}