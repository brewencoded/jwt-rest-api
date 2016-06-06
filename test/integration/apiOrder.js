const chai = require('chai'),
    expect = chai.expect,
    db = require('../../api/config').db,
    knex = require('knex')({
        client: db.client,
        connection: db.connection
    }),
    ApiOrder = require('../../api/models/apiOrder');

describe('ApiOrder model', function () {
    const api_id = 'testId',
    key = 'testKey',
    email = 'test@test.com',
    name = 'test testerson';

    before((done) => createUser({
                api_id: api_id,
                key: key,
                email: email,
                name: name,
                phone: ''
            }, done));
    after((done) => deleteUser(api_id, done));

    describe('ApiOrder creation', function () {
        after((done) => deleteOrder(api_id, done));
        it('should create an order in the database', function (done) {
            ApiOrder.forge({
                api_id: api_id
            })
            .save()
            .then((model) => {
                return knex.select()
                    .from('ApiOrders')
                    .where({
                        api_id: api_id
                    });
            })
            .then((result) => {
                expect(result[0].api_id).to.equal(api_id);
                expect(result[0].cancelled).to.equal(0);
                done();
            })
            .catch((err) => done(err));
        });
    });
    describe('ApiOrder read', function () {
        before((done) => createOrder(api_id, done));
        after((done) => deleteOrder(api_id, done));
        it('should read an existing order from the database', function (done) {
            ApiOrder.forge({
                api_id: api_id
            })
            .fetch()
            .then((model) => {
                let result = model.attributes;
                expect(result.api_id).to.equal(api_id);
                expect(result.cancelled).to.equal(0);
                done();
            })
            .catch((err) => done(err));
        });
    });
    describe('ApiOrder update', function () {
        before((done) => createOrder(api_id, done));
        after((done) => deleteOrder(api_id, done));
        it('should update an existing order\'s information in the database', function (done) {
            ApiOrder.forge({
                api_id: api_id
            })
            .fetch()
            .then((model) => {
                return model.save({
                    cancelled: true
                },
                {
                    patch: true
                });
            })
            .then(() => {
                return knex.select()
                    .from('ApiOrders')
                    .where({
                        api_id: api_id
                    });
            })
            .then((result) => {
                expect(result[0].cancelled).to.equal(1);
                done();
            })
            .catch((err) => done(err));
        });
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
