const jwt = require('../../api/auth/jwt'),
    hash = require('../../api/auth/hash'),
    expect = require('chai').expect,
    request = require('supertest'),
    db = require('../../api/config').db,
    knex = require('knex')({
        client: db.client,
        connection: db.connection
    });

describe('Public Api User Request', function () {
    let server,
        user = {
            api_id: 'testId',
            key: '',
            email: 'test@test.com',
            name: 'test testerson'
        },
        unhashedKey = 'testKey';

    before(function (done) {
        hash.createHash(unhashedKey, 10)
        .then((hash) => {
            user.key = hash;
        })
        .then(() => {
            createUser(user, done);
        })
        .catch((err) => console.log(err));
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

    describe('Get user information from /user', function () {
        let refresh, access;
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
        it('should return user info from GET: /user', function (done) {
            request(server)
                .get('/api/public/v1/user')
                .set('Authorization', 'Token ' + access)
                .query({apiId: 'testId'})
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) {
        				throw err;
        			}
                    expect(res.body.api_id).to.equal(user.api_id);
                    expect(res.body.name).to.equal(user.name);
                    expect(res.body.email).to.equal(user.email);
                    done();
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
