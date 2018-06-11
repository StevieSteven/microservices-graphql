import BaseEntity from './BaseEntity';

export default class Place extends BaseEntity {

    static get tableName() {
        return 'places';
    }

}