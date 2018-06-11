import BaseEntity from './BaseEntity';

export default class Category extends BaseEntity {

    static get tableName() {
        return 'categories';
    }

}