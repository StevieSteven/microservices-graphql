import BaseEntity from './BaseEntity';

export default class OrderItem extends BaseEntity {

    static get tableName() {
        return 'order_items';
    }

}