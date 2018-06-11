import uuid from 'uuid/v4';
import Customer from './../models/Customer';
import Address from './../models/Address';


/*
* todo  mutations are missing
 */
const resolveFunctions = {
    Query: {
        customer(_, {id}) {
            return Customer.findByUUID(id);
        },

        customers(root, args) {
            return Customer.findAll();

        },
        address(_, {id}) {
            console.log("address: id", id);
            return Address.findByUUID(id);
        },
    },
    Mutation: {
        create: (root, {input}) => { //todo check REQUIRED
            input.uuid = uuid();
            return new Promise((resolve, reject) => {
                Customer.create(input).then((user) => {
                    resolve(user)
                })
            });
        },
        update: (root, {id, input}) => {

            console.log("update: ", id );
            console.log("update: ", input );
            return Customer.findOne({where: {uuid: id}}).then(customer =>  {
                if(customer){
                    console.log("Nutzer gefunden: ", customer);


                    return new Promise((resolve, reject) => {
                        Customer.update({
                            where: {
                                id: customer.id
                            },
                            data: input
                        }).then(() => {
                            // let newUSer =
                            console.log("newUser: ", Customer.findById(customer.id));
                            resolve(Customer.findById(customer.id))
                        })
                    });
                }


            });
        }
    },
    Customer: {
        addresses: {
            resolve(root) {
                return Address.findAll({where: {
                    customer_id: root.id
                }})
            }
        }
    }
};

export default resolveFunctions;