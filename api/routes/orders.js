const ApiUser = require('../models/apiUser'),
    ApiOrder = require('../models/apiOrder'),
    ApiOrderItem = require('../models/apiOrderItem'),
    moment = require('moment'),
    jwt = require('../auth/jwt');

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

                    // create order items
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
