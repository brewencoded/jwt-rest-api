const db = require('./api/config').db;
const knex = require('knex')({
    client: db.client,
    connection: db.connection,
    useNullAsDefault: true
});

knex.schema.createTable('api_users', (table) => {
    table.string('id').primary();
    table.string('key').notNullable();
    table.string('jti').notNullable();
    table.string('email').notNullable();
    table.string('name').notNullable();
    table.timestamps();
})
.createTable('public_api_transactions', (table) => {
    table.increments('transaction_id').primary();
    table.string('api_user_id').notNullable();
    table.foreign('api_user_id').references('id').inTable('api_users');
    table.float('amount');
    table.timestamps();
})
.createTable('transactions_details', (table) => {
    table.increments('detail_id').primary();
    table.string('transaction_id').notNullable();
    table.foreign('transaction_id').references('transaction_id').inTable('public_api_transactions');
    table.string('item');
    table.float('price');
    table.integer('quantity');
})
.catch(function (e) {
    console.log(e);
});
