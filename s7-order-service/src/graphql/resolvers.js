import uuid from 'uuid/v4';
import Order from './../models/Order';
import OrderItem from './../models/OrderItem';
import Shoppingcart from './../models/ShoppingCart';
import ShoppingcartItem from './../models/ShoppingCartItem';


/*
* todo  mutations are missing
 */
const resolveFunctions = {
    Query: {
        order(_, {id}) {
            return Order.findByUUID(id);
        },
        orders(_, {customerID}) {
            return Order.findAll({
                where: {
                    customer_uuid: customerID
                }
            });
        },
        shoppingcart(_, {customerID}) {
            return Shoppingcart.findOne({
                where: {
                    customer_uuid:customerID
                }
            });
        }
    },
    Mutation: {
        putProductToCart: (root, {customerID, productID, quantity}) => {
            let putFunction = (cartId) => {
                ShoppingcartItem.create({
                    uuid: uuid(),
                    quantity: quantity,
                    product_uuid: productID,
                    shoppingcart_id: cartId
                })
            };

            Shoppingcart.findOne({
                    where: {
                        customer_uuid: customerID
                    }
                }
            ).then(cart => {
                console.log("cart: ", cart);
                if(cart && cart.id) {
                    putFunction(cart.id);
                    return cart;
                }

                Shoppingcart.create({
                    uuid: uuid(),
                    customer_uuid: customerID
                }).then(cart => {
                    putFunction(cart.id);
                    return cart;
                })

            }).catch(error => {
                console.log("error while putting product into cart: ", error);
            });



        },
        dropProductFromCart: (root, {customerID, productID}) => {
            Shoppingcart.findOne({where: {customer_uuid: customerID}}).then(cart => {
                if(cart && cart.id) {
                    ShoppingcartItem.dropAll({
                        where: {
                            shoppingcart_id:cart.id,
                            product_uuid: productID
                        }
                    })
                }

            }).catch(error => {
                console.log("error while dropping product from cart: ", error);

            })


        },
        finishOrder: (root) => {
            //TODO
        },

    },
    Order: {
        items: {
            resolve(root) {
                return OrderItem.findAll({
                    where: {
                        order_id: root.id
                    }
                })
            }
        }
    },
    Shoppingcart: {
        items: {
            resolve(root) {
                return ShoppingcartItem.findAll({
                    where: {
                        shoppingcart_id: root.id
                    }
                })
            }
        }
    }
};

export default resolveFunctions;