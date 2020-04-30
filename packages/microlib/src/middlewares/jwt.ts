export default () => async (req, res, next) => {
    req.headers && req.headers.Authorization && (req.user = require('jsonwebtoken').verify(
        req.headers.Authorization.split(' ')[1],
        String(process.env.JWT_SECRET || 'the-very-secret-secret')
    ));
    return next();
}