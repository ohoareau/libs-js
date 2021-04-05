import wrapper from '@ohoareau/aws-apigw-reqres';
import next from 'next';
import {parse} from 'url';

export const handler = wrapper(
    (req, res) => next({
        dev: (process.env.NODE_ENV !== 'production') && !process.env.AWS_NEXT_PRODUCTION,
        dir: process.env.AWS_NEXT_PROJECT_DIR || '.',
        quiet: !!process.env.AWS_NEXT_VERBOSE,
    }).getRequestHandler()(
        req,
        res,
        parse(req.url, true)
    )
);

export default handler