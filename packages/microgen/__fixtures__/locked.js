module.exports = {
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha@greenberets.io',
        },
        locked: {
            'api/abcd/def.js': true,
        }
    },
    packages: {
        api: {
            files: {
                'abcd/def.js': 'module.exports = {};',
            }
        }
    }
};
