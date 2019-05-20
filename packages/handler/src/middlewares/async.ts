export default (cfg: object, ctx: object) => next => async (event: object = {}, context: object = {}, callback: Function|undefined = undefined): Promise<any> => {
    return next(event, context, callback);
};