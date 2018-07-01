import uuid from 'uuid/v4';
import Rating from './../models/Rating';


const resolveFunctions = {
    Query: {
        rating(_, {id}) {
            return Rating.findByUUID(id);
        },
        ratingsOfCustomer(_, {customerID}) {
            return Rating.findAll({
                where: {
                    customer_uuid: customerID
                }
            });
        },
        ratingsOfProduct(_, {productID}) {
            return Rating.findAll({
                where: {
                    product_uuid: productID
                }
            });
        }
    },
    Mutation: {
        addRating: (root, {customerID, productID, stars, comment}) => {
            let input = {
                uuid: uuid(),
                customer_uuid: customerID,
                product_uuid: productID,
                timestamp: Date.now(),
                stars: stars
            };

            if (comment && comment.trim().length > 0)
                input.comment = comment.trim();

            return Rating.create(input);


        }

    }
};

export default resolveFunctions;