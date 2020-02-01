const sns = require('../services/aws/sns');

module.exports = ({o}) => async data => {
    await sns.publish({
        message: data,
        attributes: {
            fullType: o,
            type: o.replace(/_[^_]+$/, ''),
            operation: o.replace(/^.+_([^_]+)$/, '$1'),
        },
        topic: process.env.MICROSERVICE_OUTGOING_TOPIC_ARN,
    });
    return data;
};