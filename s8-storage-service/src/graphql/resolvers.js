import uuid from 'uuid/v4';
import Place from './../models/Place';


const resolveFunctions = {
    Query: {
        places(_, {productID}) {
            if(productID) {
                return Place.findAll({
                    where: {
                        product_uuid: productID
                    }
                })
            }
            return Place.findAll();
        },

    }
};

export default resolveFunctions;