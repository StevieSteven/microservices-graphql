import BaseEntity from './BaseEntity';

export default class ShoppingCartItem extends BaseEntity {

    static get tableName() {
        return 'shoppingcart_items';
    }

}