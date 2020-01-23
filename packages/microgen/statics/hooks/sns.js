module.exports = ({o, topic}) => async data => {
    await sns.publish({
        message: data,
        attributes: {
            fullType: o,
            type: o.replace(/_[^_]+$/, ''),
            operation: o.replace(/^.+_([^_]+)$/, '$1'),
        },
        topic: topic,
    });
    return data;
};