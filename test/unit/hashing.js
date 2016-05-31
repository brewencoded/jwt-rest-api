const chai = require('chai'),
    expect = chai.expect,
    hash = require('../../api/auth/hash.js'),
    bcrypt = require('bcrypt');

describe('Password hashing', function () {
    const saltRounds = 10;
    const plainText = 'testString';

    it('should hash a string based off of text', function (done) {
        const hashResult = hash.createHash(plainText, saltRounds)
        .then(function (response) {
            const matches = bcrypt.compareSync(plainText, response);
            expect(matches).to.be.true;
            done();
        })
        .catch(function (error) {
            console.log(error);
            done();
        });
    });
});
