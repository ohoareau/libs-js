const awskinesis = new (require('aws-sdk/clients/kinesis'));

const putRecord = async (data: string, partitionKey: string, streamName: string) => {
    return awskinesis.putRecord({
        Data: data,
        PartitionKey: partitionKey,
        StreamName: streamName,
    }).promise();
};

export const kinesis = {putRecord}

export default kinesis