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
                        console.log(result[0]);
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
    describe('ApiUser deletion', function () {
        it('should delete a user form the database');
    });
    describe('ApiUser update', function () {
        it('should update a user\'s information in the database');
    });
    describe('ApiUser Read', function () {
        it('should read a created user\'s data from the database');
    });
});
