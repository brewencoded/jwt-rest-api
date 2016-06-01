const uuid = require('node-uuid');

module.exports = {
    generateKeys: function () {
        const keyPair = {
            id: uuid.v4(),
            key: uuid.v4()
        };

        return keyPair;
    }
};
