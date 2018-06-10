import BaseEntity from './BaseEntity';

export default class Order extends BaseEntity {

    static get tableName() {
        return 'orders';
    }

}