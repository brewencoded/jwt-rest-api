const bookshelf = require('./db');

const ApiOrderItem = bookshelf.Model.extend({
    tableName: 'ApiOrderItems'
});

module.exports = bookshelf.model('ApiOrderItem', ApiOrderItem);
