# microgen

## Examples

### API Gateway JS Lambda

#### microgen.js

    module.exports = {
        packages: {
            ...
            xyz: {
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
    }