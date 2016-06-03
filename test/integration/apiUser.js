const chai = require('chai'),
    expect = chai.expect,
    db = require('../../api/config').db,
    knex = require('knex')({
        client: db.client,
        connection: db.connection
    }),
    ApiUser = require('../../api/models/apiUser');

describe('ApiUser model', function () {
    const api_id = 'testId',
        key = 'testKey',
        email = 'test@test.com',
        name = 'test testerson';
    describe('ApiUser creation', function () {
        after(function (done) {
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
                })
        });
        it('should create a new user in the database', function (done) {
            ApiUser.forge({
                api_id: api_id,
                key: key,
                phone: '',
                email: email,
                name: name
            })
            .save()
            .then((model) => {
                knex.select()
                    .from('ApiUsers')
                    .where({
                        api_id: api_id
                    })
                    .then((result) => {
                        try {
                            expect(result[0].api_id).to.equal(api_id);
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
    describe('ApiUser update', function () {
        const updatedEmail = 'test1@test.com',
            updateName = 'test1 testerson1';
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
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });
        after(function (done) {
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
                })
        });
        it('should update a user\'s information in the database', function (done) {
            ApiUser.forge({
                api_id: api_id
            })
            .fetch()
            .then((model) => {
                return model.save({
                    email: updatedEmail,
                    name: updateName
                },
                {
                    patch: 'true'
                });
            })
            .then(() => {
                knex.select()
                    .from('ApiUsers')
                    .where({
                        api_id: api_id
                    })
                    .then((result) => {
                        try {
                            expect(result[0].name).to.equal(updateName);
                            expect(result[0].email).to.equal(updatedEmail);
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
    describe('ApiUser Read', function () {
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
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });
        after(function (done) {
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
                })
        });
        it('should read a created user\'s data from the database', function (done) {
            ApiUser.forge({
                api_id: api_id
            })
            .fetch()
            .then((model) => {
                let result = model.attributes;
                try {
                    expect(result.name).to.equal(name);
                    expect(result.email).to.equal(email);
                    expect(result.api_id).to.equal(api_id);
                    expect(result.key).to.equal(key);
                    done();
                } catch (e) {
                    done(e);
                }
            })
            .catch((err) => {
                done(err);
            });
        });
    });
});
