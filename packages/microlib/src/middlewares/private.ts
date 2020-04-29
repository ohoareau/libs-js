export default () => async (req, res, next) => {
    if (!req.private || req.user) return next();
    const e: any = new Error('Unauthorized'); e.code = 401;
    throw e;
}