import {http_response, PreconditionFailedError} from "@ohoareau/lambda-utils";

async function create(query): Promise<http_response> {
    if (!query || !query.data) throw new PreconditionFailedError({data: [{violation: 'missing'}]});
    return {
        body: {},
        statusCode: 201,
    };
}
async function get(query): Promise<http_response> {
    return {
        body: {},
        statusCode: 200,
    };
}

export default {create, get};