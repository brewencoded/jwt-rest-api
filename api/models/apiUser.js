const DB = require('./db'),
    Promise = require('bluebird'),
    hash = require('../auth/hash');

const ApiUser = DB.Model.extend({
    tableName: 'ApiUsers',
    hashTimestamps: true,
    idAttribute: "id",
    initialize: function () {
        this.on('creating', this.hashPassword, this);
    },
    hashPassword: function (model, attrs, options) {
        return hash.createHash(model.attributes.password, 10)
            .then((hash) => {
                model.set('password', hash);
            })
            .catch((err) -> {
                throw new Error(err);
            });
    }
});
