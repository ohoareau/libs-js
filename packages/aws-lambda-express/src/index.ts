import wrapper from '@ohoareau/aws-lambda-reqres';

export function handlerFactory(app: {handle: Function}) {
    return wrapper(app.handle.bind(app))
}

export function serverFactory(app: {listen: Function}) {
    const port = process.env.PORT || 3000;
    const url = `http://localhost:${port}`;
    let awsRegion: string | undefined = 'unknown';
    try {
        awsRegion = require('aws-sdk').config.region
    } catch (e) {
        awsRegion = undefined;
    }
    app.listen(port, () => {
        console.log(`🚀 Server ready at ${url}${awsRegion ? ` (AWS region is ${awsRegion})` : ''}`);
    });
}

export default handlerFactory