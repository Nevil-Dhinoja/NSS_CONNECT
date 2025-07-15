const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ 
            error: 'Authentication required',
            message: 'No authorization token provided. Please log in again.' 
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    error: 'Token expired',
                    message: 'Your session has expired. Please log in again.' 
                });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ 
                    error: 'Invalid token',
                    message: 'Invalid authentication token. Please log in again.' 
                });
            } else {
                return res.status(401).json({ 
                    error: 'Token verification failed',
                    message: 'Authentication failed. Please log in again.' 
                });
            }
        }

        req.user = user;
        next();
    });
};
