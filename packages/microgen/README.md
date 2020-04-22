# microgen

## Examples

### Override Table Name in Dynamoose

    module.exports = {
        packages: {
            ...
            api: {
                ...
                microservices: {
                    ...
                    user: {
                        types: {
                            ...
                            user: {
                                backends: [
                                    {type: 'backend', name: 'backend', realName: '@dynamoose', tableName: 'MyUserTable'},
                                ],
                                ...
                            },
                        }
                    }
                }
            }
        }
    }

### Enable Middleware(s)

    module.exports = {
        packages: {
            api: {
                microservices: {
                    ...
                    user: {
                        types: {
                            ...
                            user: {
                                operations: {
                                    ...
                                    create: {
                                        middlewares: ['@authorization']
                                        ...
                                    },
                                }
                            },
                        }
                    }
                }
            }
        }
    }

### API Gateway JS Lambda

#### microgen.js

    module.exports = {
        packages: {
            ...
            api: {
                ...
                handlers: {
                    handler: {
                        type: 'apigateway',
                        vars: {
                            routes: {
                                'GET /user': 'user_user_getCurrent',
                                'DELETE /posts': 'post_post_delete',
                            }
                        }
                    }
                }
            }
        }
    }