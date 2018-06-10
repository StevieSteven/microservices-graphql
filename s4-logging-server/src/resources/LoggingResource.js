import express from 'express';
import uuid from 'uuid/v4';


import {clean} from './Response';
// import Response from './Response';
import Log from './../models/Log';

const CASTING = {
    serviceID: "service_id"
};

const casting = (obj) => {
    Object.keys(CASTING).forEach(key => {
        if(obj[key]) {
            obj[CASTING[key]] = obj[key];
            delete obj[key];
        }
    });
    return obj;
};

const Response = (req, res, promise, code = 200) => {
    promise.then(data => {
        let cleanedData = clean(data);
        if (req.params.id) {
            cleanedData['_links'] = {
                self: {href: req.originalUrl}
            };
        }
        res.status(code);
        res.json(cleanedData);

    }).catch(error => {
        res.status(400);
        res.json({
            success: false,
            message: error
        })
    })
};


let router = express.Router();

router.get('/', (req, res) => {
    Response(req, res, Log.findAll());
});

router.get('/:id', (req, res) => {
    Response(req, res, Log.findByUUID(req.params['id']));
});

router.put('/:id', (req, res) => {
    Log.findByUUID(req.params['id']).then(data => {
        Response(req, res, Log.updateByUUID(req.params['id'], casting(req.body)))
    }).catch(error => {
        res.status(500);
        res.json({
            success: false,
            message: error
        })
    });
});

/*
todo : implementation
 */
router.post('/', (req, res) => {
    const REQUIRED = ['serviceID', 'message'];
    let body = casting(req.body);
    console.log("casted body: ", body);
    if (!body) {
        res.status(400);
        res.json({
            success: false,
            message: "informations are missing"
        });
        return;
    }

    REQUIRED.forEach(item => {
        if (!body[item]) {
            res.status(400);
            res.json({
                success: false,
                message: `${item} information is missing`
            })
        }
    });



    let input = req.body;
    input.uuid = uuid();

    console.log("input: ", input);

    Response(req, res, Log.create(input), 201);

});

router.delete('/:id', (req, res) => {
    Log.findByUUID(req.params['id']).then(data => {
        Response(req, res, Log.drop(data.id))
    }).catch(error => {
        res.status(500);
        res.json({
            success: false,
            message: error
        })
    });
});


export default router;