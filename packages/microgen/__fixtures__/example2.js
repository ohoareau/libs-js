module.exports = {
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha@greenberets.io',
        },
    },
    packages: {
        xinea: {
            handlers: {
                handler: {
                    type: 'ping',
                },
            },
            microservices: {
                user: {
                    types: {
                        user: {
                            backends: ['dynamoose'],
                            operations: {
                                create: {},
                            }
                        }
                    }
                }
            }
        }
    }
};
