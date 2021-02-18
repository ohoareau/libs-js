import {createRouterHandler} from "@ohoareau/lambda-utils";
import imageman, {imageman_args} from '@ohoareau/imageman';
import parseEvent from "./utils/parseEvent";

export default function() {

    // this lambda handler will handle completely the http event coming from an API Gateway api
    // features are (not exhaustive): resizing of source images, flipping, conversion (svg => png, ...)

    return createRouterHandler(

        // this function will be called only if the requested resource is not favicon/robots.txt/...
        // this is the heart of the microservice, the custom part.

        async function ({config, responses}, event, context) {

            // the `event` contains the API Gateway raw event
            // the `config` object is coming from the configuration file (config.js)
            // the `responses` variable contains helpers for sending common responses (redirect, notfound, ...)
            // we need to parse this event to build the order we want to send to imageman.
            // options are used for contentType and http options for the response.

            const {options, ...order} = await parseEvent(event, context, config);

            // the order is shaped, we now call the imageman processor and return
            // the content of the resulting buffer from imageman

            const buffer = await imageman(order as imageman_args);

            // the final response will be compatible with API Gateway (statusCode, body, ...)

            return responses.buffer({buffer, ...options});

        }
    );

}