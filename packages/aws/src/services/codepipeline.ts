const awscp = new (require('aws-sdk/clients/codepipeline'))({region: process.env.AWS_CODEPIPELINE_REGION || process.env.AWS_REGION});

export const codepipeline = {
    startPipeline: async (name) =>
        awscp.startPipelineExecution({name}).promise()
    ,
    stopPipelineExecution: async (name, executionId, reason: string|undefined = undefined, abandon: boolean = true) =>
        awscp.stopPipelineExecution({
            pipelineName: name,
            pipelineExecutionId: executionId,
            abandon,
            reason,
        }).promise()
    ,
    getPipelineState: async (name) =>
        awscp.getPipelineState({name}).promise()
    ,
}

export default codepipeline