# aws-apigw-vx

Use your api-gateway-v1-compatible-only lambda with API Gateway v1 or v2 without changing your code.

## Introduction

This wrapper will detect incoming event/payload version and convert it to v1 payload format.
(More information on [payload format versions here](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html))

## Usage

Without VX:

    ...
    
    module.exports = {handler: myHandler}

With VX:

    const {vx} = require('@ohoareau/aws-apigw-vx');
    
    ...
    
    module.exports = {handler: vx(myHandler)}