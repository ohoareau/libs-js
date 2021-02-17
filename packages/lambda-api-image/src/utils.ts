export async function parseEvent(event: any, config: any = {}, context: any = {}): Promise<{input: string, operations: any[], output: string, sourceTypes: any, targetTypes: any, options: any}> {
    // path is (event?.requestContext?.http?.path || '/').slice(1);

    return {
        input: `file://${__dirname}/../assets/demo.jpg`,
        operations: [
            {type: 'resize', width: 640, height: 373.5},
            {type: 'grayscale'},
        ],
        output: 'buffer',
        sourceTypes: {},
        targetTypes: {},
        options: {
            contentType: 'image/jpeg',
        },
    }
}