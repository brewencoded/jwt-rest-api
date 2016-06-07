const jwt = require('jsonwebtoken'),
    SECRET = require('../config').secret,
    uuid = require('node-uuid');

module.exports = {
    createToken: function (apiId, hasId, scopes) {
        let options;

        if (hasId) { // for refresh token
            options = {
                jwtid: uuid.v4(),
                issuer: 'http://divvee.com',
                expiresIn: '7d'
            };
        } else { // for access token
            options = {
                expiresIn: '15m',
                issuer: 'http://divvee.com'
            };
        }

        const tokenPromise = new Promise(function (resolve, reject) {
            jwt.sign({ // create json web token
                apiId: apiId,
                scopes: scopes
            },
            SECRET,
            options,
            (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });

        return tokenPromise;
    },
    validateToken: function (token) {
        const tokenPromise = new Promise(function (resolve, reject) {
            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });

        return tokenPromise;
    }
};
