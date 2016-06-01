const chai = require('chai'),
    expect = chai.expect,
    chaiAsPromised = require('chai-as-promised'),
    hash = require('../../api/auth/hash.js'),
    bcrypt = require('bcrypt');

chai.use(chaiAsPromised);


describe('Text hashing', function () {
    const saltRounds = 10;
    const plainText = 'testString';

    it('should hash a string based off of text', function (done) {
        const hashResult = hash.createHash(plainText, saltRounds)
        .then(function (response) {
            const matches = bcrypt.compareSync(plainText, response);
            try {
                expect(matches).to.be.true;
                done();
            } catch(e) {
                done(e);
            }
        })
        .catch(function (error) {
            console.log(error);
            done();
        });
    });
});

describe('Text hash comparison', function () {
    let hashedText;
    const saltRounds = 10;
    const plainText = 'testString';

    before(function (done) {
        bcrypt.hash(plainText, saltRounds, (err, hash) => {
            if (err) {
                console.log(err);
                done();
            } else {
                hashedText = hash;
                done();
            }
        })
    });

    it('should return true if text and hash match', function () {
        const comparison = hash.compareHash(plainText, hashedText)

        return expect(comparison).to.eventually.be.true;
    });
});
