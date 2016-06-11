const jwt = require('../../api/auth/jwt'),
    hash = require('../../api/auth/hash'),
    expect = require('chai').expect,
    request = require('supertest'),
    db = require('../../api/config').db,
    knex = require('knex')({
        client: db.client,
        connection: db.connection
    });

describe('Public Api Order Request', function () {
    let server,
        user = {
            api_id: 'testId',
            key: '',
            email: 'test@test.com',
            name: 'test testerson'
        },
        unhashedKey = 'testKey',
        testItem = {
            name: 'testName',
            size: 'testSize',
            price: 12.34,
            quantity: 2
        };

    before(function (done) {
        hash.createHash(unhashedKey, 10)
        .then((hash) => {
            user.key = hash;
        })
        .then(() => {
            createUser(user, done);
        })
        .catch((err) => done(err));
    });
    after(function (done) {
        deleteUser(user.api_id, done);
    });
	beforeEach(function () {
		delete require.cache[require.resolve('../../index')];
		server = require('../../index');
	});
    afterEach(function (done) {
        server.close(done);
    });

    describe('Add a new order to the database from /order', function () {
        let refresh, access;
        after(function (done) {
            let transaction_id;
            knex.select()
            .from('ApiOrders')
            .where({
                api_id: user.api_id
            })
            .then((rows) => {
                return knex.del()
                    .from('ApiOrderItems')
                    .where({
                        transaction_id: rows[0].transaction_id
                    });
            })
            .then(() => {
                return knex.del()
                    .from('ApiOrders')
                    .where({
                        api_id: user.api_id
                    });
            })
            .then(() => done())
            .catch((err) => done(err));
        });
        it('should return a refresh token from POST: /auth', function (done) {
            let credentials = new Buffer(user.api_id + ':' + unhashedKey).toString('base64');
            request(server)
                .post('/api/public/v1/auth')
                .set('Authorization', 'Basic ' + credentials)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) {
        				throw err;
        			}
                    jwt.validateToken(res.body.token)
                    .then((decoded) => {
                        expect(decoded.jti).to.not.be.undefined;
                        expect(decoded.scopes.access).to.equal('public');
                        refresh = res.body.token;
                        done();
                    })
                    .catch((err) => done(err));
                });
        });
        it('should return an access token from GET: /auth', function (done) {
            request(server)
                .get('/api/public/v1/auth')
                .set('Authorization', 'Token ' + refresh)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) {
        				throw err;
        			}
                    jwt.validateToken(res.body.token)
                    .then((decoded) => {
                        expect(decoded.jti).to.be.undefined; // access tokens have no jti
                        expect(decoded.scopes.access).to.equal('public');
                        expect(decoded.exp).to.not.be.undefined;
                        access = res.body.token;
                        done();
                    })
                    .catch((err) => done(err));
                });
        });
        it('should add a new order into the database: POST: /order', function (done) {
            request(server)
                .post('/api/public/v1/order')
                .set('Authorization', 'Token ' + access)
                .send({
                    api_id: user.api_id,
                    order: {
                        items: [
                            testItem
                        ]
                    }
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    let transaction_id;
                    if (err) {
        				done(err);
        			}
                    knex.select()
                    .from('ApiOrders')
                    .where({
                        api_id: user.api_id
                    })
                    .then((rows) => {
                        transaction_id = rows[0].transaction_id;
                        expect(rows[0].api_id).to.equal(user.api_id);

                        return knex.select()
                            .from('ApiOrderItems')
                            .where({
                                transaction_id: rows[0].transaction_id
                            });
                    })
                    .then((rows) => {
                        console.log(rows);
                        expect(rows[0].name).to.equal(testItem.name);
                        expect(rows[0].size).to.equal(testItem.size);
                        expect(rows[0].price).to.equal(testItem.price);
                        expect(rows[0].quantity).to.equal(testItem.quantity);
                        done();
                    })
                    .catch((err) => done(err));
                });
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
