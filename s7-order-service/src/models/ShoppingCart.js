import BaseEntity from './BaseEntity';

export default class ShoppingCart extends BaseEntity {

    static get tableName() {
        return 'shoppingcarts';
    }

}