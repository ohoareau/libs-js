import wrapper from '@ohoareau/aws-apigw-reqres';
import next from 'next';
import {parse} from 'url';

export default wrapper(
    (req, res) => next({dev: process.env.NODE_ENV !== 'production'}).getRequestHandler()(
        req,
        res,
        parse(req.url, true)
    )
)