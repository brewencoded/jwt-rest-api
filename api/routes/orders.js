const db = require('../models/db'),
    ApiUser = require('../models/apiUser'),
    ApiOrder = require('../models/apiOrder'),
    ApiOrderItem = require('../models/apiOrderItem'),
    moment = require('moment'),
    jwt = require('../auth/jwt'),
    BPromise = require('bluebird'),
    validator = require('../util/inputValidation');

module.exports = function (router) {
    /**
    * middleware
    **/
    router.use('/order', function (req, res, next) {
        const token = req.headers.authorization.split(' ')[1];
        jwt.validateToken(token)
        .then((decoded) => {
            if(decoded) {
                req.decoded = decoded;
                next();
            } else {
                res.status(401).json({
                    message: 'Invalid token'
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Something went wrong. If you are receiving this message please contact the maintainer.',
                error: err
            });
        });
    });

    /**
    * route logic
    **/
    router.route('/order')
        .post(function (req, res) { // create new order
            if(req.body && req.body.api_id && req.body.order && req.body.order.items) {
                if(!validator.invalidItems(req.body.order.items)) {
                    res.status(400).json({
                        message: 'One or more of the items on your order is improperly formatted or missing arguments'
                    });
                } else {
                    ApiUser.forge({
                        api_id: req.body.api_id
                    })
                    .fetch()
                    .then((model) => {
                        if(!model) {
                            throw new Error('User does not exist');
                        } else if (req.decoded.apiId !== model.attributes.api_id) {
                            throw new Error('You do not have permission to access this user');
                        } else {
                            return ApiOrder.forge({
                                api_id: model.attributes.api_id
                            }).save();
                        }
                    })
                    .then((model) => {
                        return db.transaction(function (transaction) {
                            return BPromise.map(req.body.order.items, function (item) {
                                return ApiOrderItem.forge({
                                    transaction_id: model.attributes.transaction_id,
                                    name: item.name,
                                    size: item.size,
                                    price: item.price,
                                    quantity: item.quantity
                                }).save(null, {transacting: transaction});
                            });
                        });
                    })
                    .then((result) => {
                        res.status(200).json({
                            message: 'Successfully added order'
                        });
                    })
                    .catch((err) => {
                        switch (err.message) {
                            case 'You do not have permission to access this user':
                                res.status(403).json({
                                    message: err.message
                                });
                                break;
                            case 'User does not exist':
                                res.status(404).json({
                                    message: err.message
                                });
                                break;
                            default:
                                serverError(res, err);
                        }
                    });
                }
            } else {
                missingParams(res);
            }
        })
        .put(function (req, res) { // update order

        })
        .delete(function (req, res) { // cancel order

        });

        // TODO: /orders route for batch processing
};

function missingParams (res) {
    res.status(400).json({
        message: 'You are missing required parameters.'
    });
}

function serverError (res, err) {
    res.status(500).json({
        message: 'Something went wrong. If you are receiving this message please contact the maintainer.',
        error: err
    });
}
