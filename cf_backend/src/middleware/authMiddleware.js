const jwt = require('jsonwebtoken');
const baseResponse = require('../utils/baseResponseUtils');

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { id: decoded.id };
            next();
        } catch (error) {
            return baseResponse(res, false, 401, 'Not authorized, token failed');
        }
    }

    if (!token) {
        return baseResponse(res, false, 401, 'Not authorized, no token');
    }
};

module.exports = { protect };