const chai = require('chai'),
    expect = chai.expect,
    db = require('../../api/config').db,
    knex = require('knex')({
        client: db.client,
        connection: db.connection
    }),
    ApiOrderItem = require('../../api/models/apiOrderItem');

describe('ApiOrderItem model', function () {
    describe('ApiOrderItem creation', function () {
        it('should create an order item in the database');
    });
    describe('ApiOrderItem read', function () {
        it('should read an existing order from the database');
    });
    describe('ApiOrderItem update', function () {
        it('should update an existing user\'s information in the database');
    });
});

function createUser(user, done) {
    knex.insert(user)
        .into('ApiUsers')
        .then(() => done())
        .catch((err) => done(err));
}

function deleteUser(api_id, done) {
    knex.del()
        .from('ApiUsers')
        .where({
            api_id: api_id
        })
        .then(() => done())
        .catch((err) => done(err));
}

function createOrder(api_id, done) {
    knex.insert({
            api_id: api_id
        })
        .into('ApiOrders')
        .then(() => done())
        .catch((err) => done(err));
}

function deleteOrder(api_id, done) {
    knex.del()
        .from('ApiOrders')
        .where({
            api_id: api_id
        })
        .then(() => done())
        .catch((err) => done(err));
}

function createOrderItem(item, transaction_id, done) {
    knex.insert(item)
        .into('ApiOrderItems')
        .then(() => done())
        .catch((err) => done(err));
}

function deleteOrderItem(transaction_id, done) {
    knex.del()
        .from('ApiOrderItems')
        .where({
            transaction_id: transaction_id
        })
        .then(() => done())
        .catch((err) => done(err));
}
