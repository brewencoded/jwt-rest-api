const bookshelf = require('./db');

require('./ApiOrderItem');

const ApiOrder = bookshelf.Model.extend({
    tableName: 'ApiOrders',
    idAttribute: 'transaction_id',
    hashTimestamps: true,
    orderItems: function () {
        return this.hasMany('ApiOrderItem', 'transaction_id');
    }
});

module.exports = bookshelf.model('ApiOrder', ApiOrder);
