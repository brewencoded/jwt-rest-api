const ApiUser = require('../models/apiUser'),
    validator = require('../util/inputValidation'),
    moment = require('moment'),
    jwt = require('../auth/jwt');

module.exports = function (router) {
    /**
    * middleware
    **/
    router.use('/user', function (req, res, next) {
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
    // input Validation
    router.put('/user', function (req, res, next) {
        const rejected = validator.rejectArgs('user', req.body.updates);
        if(rejected) {
            res.status(403).json({
                message: 'You do not have permission to alter your id or api key. Contact support if you wish to do so.'
            });
        }  else {
            next();
        }
    });

    /**
    * route logic
    **/
    router.route('/user')
        .get(function (req, res) {
            if(req.query && req.query.api_id) {
                ApiUser.forge({
                    api_id: req.query.api_id
                })
                .fetch()
                .then((model) => {
                    const attrs = model.attributes;
                    if (req.query.apiId !== req.decoded.apiId) {
                        res.status(403).json({
                            message: 'You do not have permission to access this user'
                        });
                    } else if (!model) {
                        res.status(404).json({
                            message: "User does not exist"
                        });
                    } else {
                        res.status(200).json({
                            api_id: attrs.api_id,
                            name: attrs.name,
                            phone: attrs.phone,
                            email: attrs.email,
                            created: attrs.created_at
                        });
                    }
                })
                .catch((err) => {
                    serverError(res, err);
                });
            } else {
                missingParams(res);
            }
        })
        .put(function (req, res) {
            if(req.body && req.body.api_id && req.body.updates && req.body.updates.length > 0) {
                ApiUser.forge({
                    api_id: req.body.api_id
                })
                .fetch()
                .then((model) => {
                    if(!model || !model.attributes || !model.attributes.api_id) {
                        throw new Error('User does not exist');
                    } else if (req.decoded.apiId !== model.attributes.api_id) {
                        throw new Error('You do not have permission to access this user');
                    } else {
                        return model.save(req.body.updates,
                        {
                            patch: true
                        });
                    }
                })
                .then(() => {
                    res.status(200).json({
                        message: 'Successfully updated.'
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
            } else {
                missingParams(res);
            }
        })
        .delete(function (req, res) {
            if (req.body && req.body.api_id) {
                ApiUser.forge({
                    api_id: req.body.api_id
                })
                .fetch()
                .then((model) => {
                    if(!model || !model.attributes || !model.attributes.api_id) {
                        throw new Error('User does not exist');
                    } else if (req.decoded.apiId !== req.body.api_id) {
                        throw new Error('You do not have permission to access this user');
                    } else {
                        return model.save({
                            disabled: true,
                            disabled_at: moment().format("YYYY-MM-DD HH:mm:ss")
                        },
                        {
                            patch: true
                        });
                    }
                })
                .then(() => {
                    res.status(200).json({
                        message: 'Successfully updated.'
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
            } else {
                missingParams(res);
            }
        });
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
