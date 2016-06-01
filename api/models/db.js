const db = require('../config').db;

const knex = require('knex')({
    client: db.client,
    connection: db.connection
});

const bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry');

module.exports = bookshelf;
