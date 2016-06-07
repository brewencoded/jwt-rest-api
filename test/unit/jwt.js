const chai = require('chai'),
    expect = chai.expect,
    jwt = require('../../api/auth/jwt.js'),
    jsonwebtoken = require('jsonwebtoken'),
    SECRET = require('../../api/config.json').secret;

describe('JSON Web Token authentication', function () {
    describe('JWT creation', function () {
        it('should produce a three part string separated by periods', function (done) {
            jwt.createToken('testId')
            .then((token) => {
                let length = token.split('.').length;
                try {
                    expect(length).to.equal(3);
                    done();
                } catch(e) {
                    done(e);
                }
            });
        });
    });

    describe('JWT validation', function () {
        let validToken;
        let invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ";
        before(function (done) {
            jwt.createToken('testId')
            .then((token) => {
                validToken = token;
                done();
            });
        });
        it('should return decoded token for valid tokens', function (done) {
            jwt.validateToken(validToken)
            .then((decoded) => {
                try {
                    expect(decoded).to.be.a('object');
                    expect(decoded).to.have.property('iat');
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
        it('should reject invalid tokens', function (done) {
            jwt.validateToken(invalidToken)
            .then((decoded) => {
                try {
                    expect(decoded).to.be.undefined;
                    done();
                } catch (e) {
                    done(e);
                }
            })
            .catch((error) => {
                try{
                    expect(error).to.be.a('object');
                    expect(error).to.have.property('message');
                    done();
                } catch (e) {
                    done(e);
                }
            });
        });
    });
});
