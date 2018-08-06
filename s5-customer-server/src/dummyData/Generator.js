import uuid from 'uuid/v4';

import faker from 'faker';

import Customer from './../models/Customer';
import Address from "../models/Address";


const NUMBER_OF_CUSTOMERS = 50;
const NUMBER_OF_MAX_ADDRESSES_PER_CUSTOMER = 5;


class Generator {

    static customers() {
        return new Promise((resolve, reject) => {
            Address.dropAll().then(() => {
                Customer.dropAll().then(() => {
                    for (let index = 0; index < NUMBER_OF_CUSTOMERS; index++) {
                        Customer.create({
                            uuid: uuid(),
                            firstName: faker.name.firstName().replace("'", " "),
                            surname: faker.name.lastName().replace("'", " "),
                            email: faker.internet.email()
                        }).then(data => {
                            console.log("data: ", data);
                            for (let i = 0; i < faker.random.number(NUMBER_OF_MAX_ADDRESSES_PER_CUSTOMER); i++) {
                                Address.create({
                                    uuid: uuid(),
                                    customer_id: data.id,
                                    street: faker.address.streetName().replace("'", " "),
                                    number: faker.random.number(5000),
                                    postal_code: faker.address.zipCode(),
                                    city: faker.address.city().replace("'", " "),
                                    country: faker.address.country().replace("'", " ")
                                })
                            }

                        });

                    }


                });
            });


        })

    }

    //
    // static addresses () {
    //
    //     Customer.findAll().then(data => {
    //         console.log("data bei addresses: ", data);
    //         Address.create({
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
