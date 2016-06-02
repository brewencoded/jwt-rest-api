const bookshelf = require('./db'),
    hash = require('../auth/hash');

require('./apiOrder');

const ApiUser = bookshelf.Model.extend({
    tableName: 'ApiUsers',
    hashTimestamps: true,
    initialize: function () {
        this.on('creating', this.hashPassword, this);
    },
    hashPassword: function (model) {
        return hash.createHash(model.attributes.password, 10)
            .then((hash) => {
                model.set('password', hash);
            })
            .catch((err) => {
                throw new Error(err);
            });
    },
    orders: function () {
        return this.hasMany('ApiOrder', 'api_id');
    }
});

module.exports = bookshelf.model('ApiUser', ApiUser);
