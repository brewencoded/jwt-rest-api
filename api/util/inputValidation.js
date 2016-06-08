module.exports = {
    rejectArgs: function (list, obj) {
        const rejectProps = {
            user: ['api_id', 'key']
        };

        return rejectProps[list].some((prop) => obj.hasOwnProperty(prop));
    },
    invalidItems: function (obj) {
        const required = ['name','price','quantity'];
        const all = required.concat(['size']);

        const notEmptyOrMissing = required.some((prop) => {
            if (!obj[prop] || obj[prop] === '') {
                console.log(prop);
                return true;
            }
        });
        const noInvalidProps = Object.keys(obj).some((prop) => {
            if (all.indexOf(prop) === -1) {
                console.log(prop);
                return true;
            }
        });

        return noInvalidProps || notEmptyOrMissing;
    }
};
