module.exports = {
    vars: {
        author: {
            name: 'Olivier Hoareau',
            email: 'oha@greenberets.io',
        },
    },
    packages: {
        api: {
            handlers: {
                handler: {
                    type: 'apigateway',
                    vars: {
                        routes: {
                            'GET /user': 'user_user_getCurrent',
                            'POST /user': 'user_user_create',
                            'GET /users/:id': 'user_user_get',
                            'PUT /users/:id': 'user_user_update',
                            'DELETE /users/:id': 'user_user_delete',
                            'POST /some-non/standard/:route/:with/id': 'user_user_mySpecificMethod',
                        }
                    }
                },
            },
            microservices: {
                user: {
                    types: {
                        user: {
                            backends: ['dynamoose'],
                            operations: {
                                create: {},
                                get: {},
                                update: {},
                                delete: {},
                                getCurrent: {},
                                mySpecificMethod: {},
                            }
                        }
                    }
                }
            }
        }
    }
};
