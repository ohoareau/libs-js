import {http_response} from "@ohoareau/lambda-utils";

async function create(query): Promise<http_response> {
    if (!query || !query.data) throw new Error('Missing data');
    return {
        body: {
        },
        statusCode: 201,
    };
}
async function get(query): Promise<http_response> {
    return {
        body: {
        },
        statusCode: 200,
    };
}

export default {create, get};