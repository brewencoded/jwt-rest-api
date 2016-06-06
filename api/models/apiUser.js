const bookshelf = require('./db'),
    hash = require('../auth/hash');

require('./apiOrder');

const ApiUser = bookshelf.Model.extend({
    tableName: 'ApiUsers',
    hasTimestamps: true,
    idAttribute: 'id',
    initialize: function () {
        this.on('creating', this.hashApiKey, this);
    },
    hashApiKey: function (model) {
        return hash.createHash(model.attributes.key, 10)
            .then((hash) => {
                model.set('key', hash);
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
