export function cfnext(handler: Function) {
    return isCloudFrontContext() ? cloudfrontWrapper(handler) : handler;
}

export function isCloudFrontContext(): boolean {
    return false;
}

export function cloudfrontWrapper(handler: Function): (event: any, context: any) => Promise<any> {
    return async (event: any, context: any): Promise<any> => {
        const {req, res} = await prepareRequestAndResponse(event, context);
        await handler(req, res);
        return convertResponse(res);
    };
}

export function prepareRequestAndResponse(event: any, context: any): {req: any, res: any} {
    const req = {};
    const res = {};

    return {req, res};
}

export function convertResponse(res: any): any {
    return {}
}

export default cfnext