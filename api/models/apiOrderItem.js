const bookshelf = require('./db');

const ApiOrderItem = bookshelf.Model.extend({
    tableName: 'ApiOrderItems',
    idAttribute: 'id',
});

module.exports = bookshelf.model('ApiOrderItem', ApiOrderItem);
