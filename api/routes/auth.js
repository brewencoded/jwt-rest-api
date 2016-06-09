const jwt = require('../auth/jwt'),
    basicAuth = require('basic-auth'),
    hash = require('../auth/hash'),
    ApiUser = require('../models/apiUser'),
    db = require('../config').db,
    knex = require('knex')({
        client: db.client,
        connection: db.connection
    });

/**
* Token Validation
**/

module.exports = function (router) {
    router.route('/auth')
        .post(function (req, res) { // request refresh token
            // get sensitive credentials from basic authorization header
            const user = basicAuth(req);
            if (user && user.pass && user.name) {
                const api_id = user.name,
                    key = user.pass;
                    ApiUser.forge({
                        api_id: api_id
                    })
                    .fetch()
                    .then((model) => {
                        if (model) {
                            const attrs = model.attributes;
                            return hash.compareHash(key, attrs.key);
                        } else {
                            throw new Error('User does not exist');
                        }
                    })
                    .then((keysMatch) => {
                        if (keysMatch) {
                            return jwt.createToken(api_id, true, {
                                access: 'public'
                            });
                        } else {
                            throw new Error('Invalid credentials');
                        }
                    })
                    .then((token) => {
                        res.status(200).json({
                            message: 'Authenticated',
                            token: token
                        });
                    })
                    .catch((err) => {
                        switch (err.message) {
                            case 'User does not exist':
                                res.status(404).json({
                                    message: err.message
                                });
                                break;
                            case 'Invalid credentials':
                                res.status(401).json({
                                    message: err.message
                                });
                                break;
                            default:
                                res.status(500).json({
                                    message: 'Something went wrong. If you are receiving this message please contact the maintainer.',
                                    error: err
                                });
                        }
                    });
            } else {
                res.status(400).json({
                    message: 'You are missing required parameters.'
                });
            }
        })
        .get(function (req, res) { // request access token
            const refresh = req.headers.authorization.split(' ')[1];
            let api_id;
            // check if refresh token is valid
            jwt.validateToken(refresh)
            .then((decoded) => {
                // make sure it is a refresh token
                if (!decoded.jti && decoded.jti === '') {
                    throw new Error('Invalid token endpoint');
                } else if (!decoded.scopes || !decoded.scopes.access || decoded.scopes.access === '') { // make sure it has public access
                    throw new Error('You do not have access to this API');
                } else { // make sure jwtid is not on the blacklist
                    api_id = decoded.apiId;
                    return knex.select('*')
                    .from('TokenBlackList')
                    .where({
                        jti: decoded.jti
                    });
                }
            })
            .then((rows) => {
                if(rows.length === 0) {
                    // create access token
                    return jwt.createToken(api_id, null, {
                        access: 'public'
                    });
                } else {
                    throw new Error('Token blacklisted');
                }
            })
            .then((token) => {
                // return access token
                res.status(200).json({
                    message: 'Authenticated',
                    token: token
                });
            })
            .catch((err) => {
                switch (err.message) {
                    case 'Invalid token endpoint':
                        res.status(401).json({
                            message: err.message
                        });
                        break;
                    case 'You do not have access to this API':
                        res.status(401).json({
                            message: err.message
                        });
                        break;
                    case 'Token blacklisted':
                        res.status(401).json({
                            message: err.message
                        });
                        break;
                    default:
                        res.status(401).json({
                            message: 'Invalid token'
                        });
                }
            });
        });
};
