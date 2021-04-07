import wrapper from '@ohoareau/aws-lambda-reqres';

export const handlerFactory = app => wrapper((app as any).handle.bind(app));

export default handlerFactory