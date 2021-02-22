import {createRouterHandler} from "@ohoareau/lambda-utils";

export default function() {

    // this lambda handler will handle completely the http event coming from an API Gateway api

    return createRouterHandler(

        // this function will be called only if the requested resource is not favicon/robots.txt/...
        // this is the heart of the microservice, the custom part.

        async function ({resourcePath, path, config, responses}, event, context) {

            return responses.notYetImplemented();

        }
    );

}