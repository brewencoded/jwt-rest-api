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
});
