import {v4 as uuid} from 'uuid';
const cloudfront = new (require('aws-sdk/clients/cloudfront'))({region: process.env.AWS_CLOUDFRONT_REGION || process.env.AWS_REGION});

const createInvalidation = async (distribution, uri: string|string[], invalidationReference?: string): Promise<any> => {
    const uris: string[] = Array.isArray(uri) ? <string[]>uri : [uri];
    return cloudfront.createInvalidation({
        DistributionId: distribution,
        InvalidationBatch: {
            CallerReference: invalidationReference || uuid(),
            Paths: {
                Quantity: uris.length,
                Items: uris,
            }
        }
    }).promise();
};

const invalidateUri = async (distribution, uri: string|string[], invalidationReference?: string): Promise<any> =>
    createInvalidation(distribution, uri, invalidationReference)
;

export default {
    invalidateUri,
    createInvalidation,
}