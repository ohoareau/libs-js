# aws-cf-next

Use your next in your lambda @edge (below CloudFront) without changing your code.
The wrapper will detect if your are running into local mode (non-cloudfront) or AWS-mode (via CloudFront)

## Introduction

This wrapper will detect incoming event/payload from CloudFront and it to next server side function.

## Usage

    const cfnext = require('@ohoareau/aws-cf-next');
    
    ...
    
    module.exports = {handler: cfnext(myHandler)}