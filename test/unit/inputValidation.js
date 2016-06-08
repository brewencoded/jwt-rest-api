const chai = require('chai'),
    expect = chai.expect,
    validator = require('../../api/util/inputValidation.js');

describe('Input Validation', function () {
    describe('Parameter rejection', function () {
        it('should return true if the object does contain forbidden properties', function () {
            let rejected = validator.rejectArgs('user', {
                api_id: 'test'
            });
            expect(rejected).to.be.true;
        });
        it('should return false if the object does not contain forbidden properties', function () {
            let rejected = validator.rejectArgs('user', {
                testProp: 'test'
            });
            expect(rejected).to.be.false;
        });
    });
    describe('Item validation', function () {
        it('should return true if an item is missing a required property', function () {
            const missing = {
                name: 'testName',
                size: 'testSize',
                price: 12.34
            };
            expect(validator.invalidItems(missing)).to.be.true;
        });
        it('should return true if an item has an empty required property', function () {
            const empty = {
                name: '',
                size: 'testSize',
                price: 12.34,
                quantity: 2
            };
            expect(validator.invalidItems(empty)).to.be.true;
        });
        it('should return true if an item has an invalid property', function () {
            const invalid = {
                name: 'testName',
                size: 'testSize',
                price: 12.34,
                quantity: 2,
                blah: 'test'
            };
            expect(validator.invalidItems(invalid)).to.be.true;
        });
        it('should return false if item passed in is valid', function () {
            const valid = {
                name: 'testName',
                size: 'testSize',
                price: 12.34,
                quantity: 2
            };
            expect(validator.invalidItems(valid)).to.be.false;
        });
    });
});
