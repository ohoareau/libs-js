export default ({config: {prefix}}) => next => async ({req, res}) => {
    const r = await next({req, res});
    r.res.result = `${prefix}${await r.res.result}`;
    return r;
}