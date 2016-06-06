module.exports = {
    rejectArgs: function (list, obj) {
        const rejectProps = {
            user: ['api_id', 'key']
        };

        return rejectProps[list].some((prop) => obj.hasOwnProperty(prop));
    }
};
