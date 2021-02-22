import {createRouterHandler, http_response} from "@ohoareau/lambda-utils";
import webhookService from './services/webhook';
import orderService from './services/order';

export default function() {

    // this lambda handler will handle completely the http event coming from an API Gateway api
    // features are (not exhaustive): resizing of source images, flipping, conversion (svg => png, ...)

    return createRouterHandler(

        // this function will be called only if the requested resource is not favicon/robots.txt/...
        // this is the heart of the microservice, the custom part.

        async function ({resourcePath, path, config, responses}, event, context) {

            // the `event` contains the API Gateway raw event
            // the `config` object is coming from the configuration file (config.js)
            // the `responses` variable contains helpers for sending common responses (redirect, notfound, ...)

            let result: http_response|undefined = undefined;

            const query = {
                // @todo add `data` from posted data, and `id` (and others) from route-params
                event, config, context,
            };

            switch (resourcePath) {
                case 'POST /webhooks': result = await webhookService.process(query); break;
                case 'POST /orders': result = await orderService.create(query); break;
                case 'GET /orders/:id': result = await orderService.get(query); break;
                case 'GET /': result = {statusCode: 200, body: {}}; break;
                default: throw new Error(`Not Found`);
            }

            return responses.http(await result);

        }
    );

}