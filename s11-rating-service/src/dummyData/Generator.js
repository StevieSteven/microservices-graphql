import uuid from 'uuid/v4';

import faker from 'faker';

import Category from './../models/Order';
import Product from "../models/Product";


const CATEGORY_NAMES = ["Technik", "Bücher", "Filme", "Haushalt"];


const NUMBER_OF_PRODUCTS_PER_CATEGORY = 50;

class Generator {
    //
    // static categories() {
    //     return new Promise((resolve, reject) => {
    //         Product.dropAll().then(() => {
    //             Order.dropAll().then(() => {
    //                 CATEGORY_NAMES.forEach(name => {
    //                     Order.create({
    //                         name,
    //                         uuid: uuid()
    //                     }).then(category => {
    //                         for(let index = 0; index < NUMBER_OF_PRODUCTS_PER_CATEGORY; index++) {
    //                             Product.create({
    //                                 uuid: uuid(),
    //                                 category_id: category.id,
    //                                 name: faker.commerce.productName(),
    //                                 price: faker.commerce.price(),
    //                                 description: faker.lorem.paragraph()
    //                             });
    //                         }
    //                     })
    //                 })
    //
    //             });
    //         });
    //
    //
    //     })
    //
    // }

    //
    // static addresses () {
    //
    //     Order.findAll().then(data => {
    //         console.log("data bei addresses: ", data);
    //         Product.create({
    //             uuid: uuid(),
    //             customer_id: data.id,
    //             street: faker.address.street(),
    //             number: faker.address.streetAddress()
    //         })
    //
    //     })
    // }

}


export default Generator;
