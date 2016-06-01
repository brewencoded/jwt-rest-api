const chai = require('chai'),
    expect = chai.expect,
    chaiAsPromised = require('chai-as-promised'),
    keys = require('../../api/auth/keys.js');

describe('Api key generation', function () {
    it('should return an object with two properties', function () {
        const keyPair = keys.generateKeys();

        expect(keyPair).to.be.a('object');
        expect(Object.keys(keyPair).length).to.equal(2);
    });
    it('should have a property called id and key, of type string', function () {
        const keyPair = keys.generateKeys();
        const objKeys = Object.keys(keyPair);

        expect(objKeys[0]).to.be.a('string');
        expect(objKeys[1]).to.be.a('string');

        expect(objKeys[0]).to.equal('id');
        expect(objKeys[1]).to.equal('key');
    });
});
