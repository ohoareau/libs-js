import wrapper from '@ohoareau/aws-apigw-reqres';

export const handlerFactory = app => wrapper((app as any).handle.bind(app));

export default handlerFactory