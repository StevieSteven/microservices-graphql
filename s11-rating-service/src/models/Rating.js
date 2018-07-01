import BaseEntity from './BaseEntity';

export default class Rating extends BaseEntity {

    static get tableName() {
        return 'ratings';
    }

}