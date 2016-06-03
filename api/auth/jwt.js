const jwt = require('jsonwebtoken'),
    SECRET = require('../config').secret,
    uuid = require('node-uuid');

// TODO: add scopes object to payload giving public, private, or admin access.

module.exports = {
    createToken: function (hasId) {
        let options;

        if (hasId) { // for refresh token
            options = {
                jwtid: uuid.v4(),
                issuer: 'http://divvee.com'
            };
        } else { // for access token
            options = {
                expiresIn: '1hr',
                issuer: 'http://divvee.com'
            };
        }

        const tokenPromise = new Promise(function (resolve) {
            jwt.sign({ // create json web token
            },
            SECRET,
            options,
            (err, token) => {
                if (err) {
                    resolve(err);
                } else {
                    resolve(token);
                }
            });
        });

        return tokenPromise;
    },
    validateToken: function (token) {
        const tokenPromise = new Promise(function (resolve) {
            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) {
                    resolve(err);
                } else {
                    resolve(decoded);
                }
            });
        });

        return tokenPromise;
    }
};
