export default () => next => async ({req, res}) => {
    const {req: req2, res: res2} = await next({req, res});
    res2.result = JSON.stringify(await res2.result);
    return next({req: req2, res: res2});
}