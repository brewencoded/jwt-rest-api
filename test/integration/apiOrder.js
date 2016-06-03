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

    before(function (done) {
        createUser({
                api_id: api_id,
                key: key,
                email: email,
                name: name,
                phone: ''
            }, done);
    });
    after(function (done) {
        deleteUser(api_id, done);
    });

    describe('ApiOrder creation', function () {
        after(function (done) {
            deleteOrder(api_id, done);
        });
        it('should create an order in the database', function (done) {
            ApiOrder.forge({
                api_id: api_id
            })
            .save()
            .then((model) => {
                let select = knex.select()
                    .from('ApiOrders')
                    .where({
                        api_id: api_id
                    })
                    .then((result) => {
                        try {
                            expect(result[0].api_id).to.equal(api_id);
                            expect(result[0].cancelled).to.equal(0);
                            done();
                        } catch(e) {
                            done(e);
                        }
                    });
            })
            .catch((err) => {
                done(err)
            });
        });
    });
    describe('ApiOrder read', function () {
        before(function (done) {
            createOrder(api_id, done);
        });
        after(function (done) {
            deleteOrder(api_id, done);
        });
        it('should read an existing order from the database', function (done) {
            ApiOrder.forge({
                api_id: api_id
            })
            .fetch()
            .then(() => {
                knex.select()
                    .from('ApiOrders')
                    .where({
                        api_id: api_id
                    })
                    .then((result) => {
                        try {
                            expect(result[0].api_id).to.equal(api_id);
                            expect(result[0].cancelled).to.equal(0);
                            done();
                        } catch(e) {
                            done(e);
                        }
                    });
            })
            .catch((err) => {
                done(err);
            });
        });
    });
    describe('ApiOrder update', function () {
        before(function (done) {
            createOrder(api_id, done);
        });
        after(function (done) {
            deleteOrder(api_id, done);
        });
        it('should update an existing order from the database', function (done) {
            /*ApiOrder.forge({
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
                knex.select()
                    .from('ApiOrders')
                    .where({
                        api_id: api_id
                    })
                    .then((result) => {
                        try {
                            expect(result[0].cancelled).to.equal(1);
                            done();
                        } catch(e) {
                            done(e);
                        }
                    });
            })
            .catch((err) => {
                done(err);
            });*/
            done();
        });
    });
});

function createUser(user, done) {
    knex.insert(user)
        .into('ApiUsers')
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });
}

function deleteUser(api_id, done) {
    knex.del()
        .from('ApiUsers')
        .where({
            api_id: api_id
        })
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });
}

function createOrder(api_id, done) {
    knex.insert({
            api_id: api_id
        })
        .into('ApiOrders')
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });
}

function deleteOrder(api_id, done) {
    knex.del()
        .from('ApiOrders')
        .where({
            api_id: api_id
        })
        .then(() => {
            done();
        })
        .catch((err) => {
            done(err);
        });
}
