const uuid = require('uuid/v4');
const caller = require('../services/caller');

module.exports = () => ({
    execute: async ({id, name, lambdaArn, data}) => {
        const startTime = new Date().valueOf();
        const result = await caller.executeRemoteLambda(lambdaArn, data);
        const endTime = new Date().valueOf();
        return {
            id: uuid(),
            result,
            function: {id, name, lambdaArn},
            execution: {startTime, duration: endTime - startTime, endTime}
        };
    },
});