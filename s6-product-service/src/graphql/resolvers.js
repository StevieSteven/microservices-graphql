import uuid from 'uuid/v4';
import Category from './../models/Category';
import Product from './../models/Product';


/*
* todo  mutations are missing
 */
const resolveFunctions = {
    Query: {
        product(_, {id}) {
            return Product.findByUUID(id);
        },

        categories(root, args) {
            return Category.findAll();

        }
    },
    Category: {
        products: {
            resolve(root) {
                return Product.findAll({where: {
                    category_id: root.id
                }})
            }
        }
    },
    Product: {
        category: {
            resolve(root) {
                return Category.findById(root.category_id)
            }
        }
    }
};

export default resolveFunctions;