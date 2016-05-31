const bcrypt = require('bcrypt');

module.exports = {
    createHash: function (text, saltRounds) {
        const hashPromise = new Promise(function (resolve, reject) {
            bcrypt.hash(text, saltRounds, (err, hash) => {
                if (err) {
                    resolve(err);
                } else {
                    resolve(hash);
                }
            })

        });

        return hashPromise;
    }
}
