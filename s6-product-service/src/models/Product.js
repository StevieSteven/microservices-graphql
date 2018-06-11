import BaseEntity from './BaseEntity';

export default class Product extends BaseEntity {

    static get tableName() {
        return 'products';
    }

}