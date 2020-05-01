export default ({mapping = {}}) => async (e, req, res, next) => {
    res.statusCode = ('number' === typeof e.code) ? e.code : 500;
    res.body = e.serialize ? e.serialize(): e.message;
    const c = mapping[`${res.statusCode}`];
    c && Object.assign(res, {statusCode: c.code, body: c.message});
    return next();
}