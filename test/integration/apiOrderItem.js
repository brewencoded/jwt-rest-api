const chai = require('chai'),
    expect = chai.expect,
    db = require('../../api/config').db,
    knex = require('knex')({
        client: db.client,
        connection: db.connection
    }),
    ApiOrderItem = require('../../api/models/apiOrderItem');

describe('ApiOrderItem model', function () {
    const api_id = 'testId',
    key = 'testKey',
    email = 'test@test.com',
    name = 'test testerson';

    const item = {
        transaction_id: '',
        name: 'testName',
        size: 'testSize',
        price: 12.34,
        quantity: 2
    };

    const updateItem = {
        transaction_id: '',
        name: 'testName2',
        size: 'testSize',
        price: 23.45,
        quantity: 3
    };

    before(function (done) {
        knex.insert({
            api_id: api_id,
            key: key,
            email: email,
            name: name,
            phone: ''
        })
        .into('ApiUsers')
        .then(() => {
            return knex.insert({
                api_id: api_id
            })
            .into('ApiOrders');
        })
        .then((result) => {
            item.transaction_id = result[0];
            updateItem.transaction_id = result[0];
            done();
        })
        .catch((err) => done(err));
    });
    after(function (done) {
        knex.del()
        .from('ApiOrders')
        .where({
            api_id: api_id
        })
        .then(() => {
            return knex.del()
            .from('ApiUsers')
            .where({
                api_id: api_id
            });
        })
        .then(() => done())
        .catch((err) => done(err));
    });

    describe('ApiOrderItem creation', function () {
        after(function (done) {
            deleteOrderItem(item.transaction_id, done);
        });
        it('should create an order item in the database', function (done) {
            ApiOrderItem.forge(item)
            .save()
            .then((model) => {
                return knex.select()
                    .from('ApiOrderItems')
                    .where({
                        transaction_id: item.transaction_id
                    });
            })
            .then((result) => {
                expect(result[0].transaction_id).to.equal(item.transaction_id);
                expect(result[0].name).to.equal(item.name);
                expect(result[0].size).to.equal(item.size);
                expect(result[0].price).to.equal(item.price);
                expect(result[0].quantity).to.equal(item.quantity);
                done();
            })
            .catch((err) => done(err));
        });
    });
    describe('ApiOrderItem read', function () {
        before(function (done) {
            createOrderItem(item, done)
        });
        after(function (done) {
            deleteOrderItem(item.transaction_id, done);
        });
        it('should read an existing order from the database', function (done) {
            ApiOrderItem.forge({
                transaction_id: item.transaction_id
            })
            .fetch()
            .then((model) => {
                let result = model.attributes;
                expect(result.transaction_id).to.equal(item.transaction_id);
                expect(result.name).to.equal(item.name);
                expect(result.size).to.equal(item.size);
                expect(result.price).to.equal(item.price);
                expect(result.quantity).to.equal(item.quantity);
                done();
            })
            .catch((err) => done(err));
        });
    });
    describe('ApiOrderItem update', function () {
        before(function (done) {
            createOrderItem(item, done)
        });
        after(function (done) {
            deleteOrderItem(item.transaction_id, done);
        });
        it('should update an existing order item\'s information in the database', function (done) {
            ApiOrderItem.forge({
                transaction_id: item.transaction_id
            })
            .fetch()
            .then((model) => {
                return model.save(updateItem,
                {
                    patch: true
                });
            })
            .then(() => {
                return knex.select()
                    .from('ApiOrderItems')
                    .where({
                        transaction_id: item.transaction_id
                    });
            })
            .then((result) => {
                expect(result[0].transaction_id).to.equal(item.transaction_id);
                expect(result[0].name).to.equal(updateItem.name);
                expect(result[0].price).to.equal(updateItem.price);
                expect(result[0].quantity).to.equal(updateItem.quantity);
                expect(result[0].size).to.equal(updateItem.size);
                done();
            })
            .catch((err) => done(err));
        });
    });
});

function createOrderItem(item, done) {
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
