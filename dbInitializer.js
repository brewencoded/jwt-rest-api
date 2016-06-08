const db = require('./api/config').db;
const knex = require('knex')({
    client: db.client,
    connection: db.connection
});

/**
* Prerequisite: create a database as specified in /api/config.json or modify the file to fit your setup
**/

console.log('building database...');
knex.schema
    .createTable('ApiUsers', (table) => {
        table.increments('id').primary();
        table.string('api_id').unique().notNullable();
        table.string('key').notNullable();
        table.string('email').notNullable();
        table.string('phone');
        table.string('name').notNullable();
        table.boolean('disabled');
        table.timestamp('disabled_at');
        table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
        table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
        table.engine('InnoDB');
    })
    .createTable('ApiOrders', (table) => {
        table.increments('transaction_id').primary();
        table.boolean('cancelled').defaultTo(false);
        table.string('api_id').notNullable().references('api_id').inTable('ApiUsers').onUpdate('CASCADE');
        table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
        table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
        table.engine('InnoDB');
    })
    .createTable('ApiOrderItems', (table) => {
        table.increments('id').primary();
        table.integer('transaction_id').unsigned().notNullable().references('transaction_id').inTable('ApiOrders').onUpdate('CASCADE');
        table.string('name').notNullable();
        table.string('size');
        table.float('price').notNullable();
        table.integer('quantity').notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
        table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
        table.engine('InnoDB');
    })
    .createTable('TokenBlackList', (table) => {
        table.increments('id').primary();
        table.string('jti').unique().notNullable();
        table.dateTime('expires').notNullable();
        table.engine('InnoDB');
    })
    .then((results) => {
        console.log('success...');
        knex.destroy();
    })
    .catch((e) => {
        console.log(e);
    });
