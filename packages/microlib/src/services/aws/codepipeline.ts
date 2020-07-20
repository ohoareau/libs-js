const codepipeline = new (require('aws-sdk/clients/codepipeline'))({region: process.env.AWS_CODEPIPELINE_REGION || process.env.AWS_REGION});

export default {
    startPipeline: async (name) =>
        codepipeline.startPipelineExecution({name}).promise()
    ,
    stopPipelineExecution: async (name, executionId, reason: string|undefined = undefined, abandon: boolean = true) =>
        codepipeline.stopPipelineExecution({
            pipelineName: name,
            pipelineExecutionId: executionId,
            abandon,
            reason,
        }).promise()
    ,
    getPipelineState: async (name) =>
        codepipeline.getPipelineState({name}).promise()
    ,
}