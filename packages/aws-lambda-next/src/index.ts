import wrapper from '@ohoareau/aws-lambda-reqres';
import next from 'next';
import {parse} from 'url';

export const handler = wrapper(
    async (req, res) => {
        const app = next({
            dev: (process.env.NODE_ENV === 'development') || (process.env.NODE_ENV !== 'production') && (!process.env.AWS_NEXT_PRODUCTION && !process.env.LAMBDA_TASK_ROOT),
            dir: process.env.AWS_NEXT_PROJECT_DIR || process.env.LAMBDA_TASK_ROOT || '.',
            quiet: !process.env.AWS_NEXT_VERBOSE,
        });
        await app.prepare();
        return app.getRequestHandler()(req, res, parse(req.url, true))
    }
);

export default handler