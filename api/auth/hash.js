const bcrypt = require('bcrypt');

module.exports = {
    createHash: function (text, saltRounds) {
        const hashPromise = new Promise(function (resolve) {
            bcrypt.hash(text, saltRounds, (err, hash) => {
                if (err) {
                    resolve(err);
                } else {
                    resolve(hash);
                }
            });

        });

        return hashPromise;
    },
    compareHash: function (text, hash) {
        const comparePromise = new Promise(function (resolve) {
            bcrypt.compare(text, hash, (err, res) => {
                if (err) {
                    resolve(err);
                } else {
                    resolve(res);
                }
            });
        });

        return comparePromise;
    }
};
