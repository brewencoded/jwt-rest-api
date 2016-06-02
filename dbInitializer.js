const db = require('./api/config').db;
const knex = require('knex')({
    client: db.client,
    connection: db.connection
});

knex.schema
    .createTable('ApiUsers', (table) => {
        table.increments('id').primary();
        table.string('api_id').unique();
        table.string('key').notNullable();
        table.string('jti').notNullable();
        table.string('email').notNullable();
        table.string('phone');
        table.string('name').notNullable();
        table.timestamps();
        table.engine('InnoDB');
    })
    .createTable('ApiOrders', (table) => {
        table.increments('transaction_id').primary();
        table.string('api_id').notNullable().references('api_id').inTable('ApiUsers').onDelete('CASCADE');
        table.timestamps();
        table.engine('InnoDB');
    })
    .createTable('ApiOrderItems', (table) => {
        table.increments('id').primary();
        table.integer('transaction_id').unsigned().notNullable().references('transaction_id').inTable('ApiOrders').onDelete('CASCADE');
        table.string('name');
        table.float('price');
        table.integer('quantity');
        table.engine('InnoDB');
    })
    .then((results) => {
        console.log('success...');
        knex.destroy();
    })
    .catch((e) => {
        console.log(e);
    });
