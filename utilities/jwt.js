const jwt = require('jsonwebtoken');
const client = require('./redis');

// Middleware to check the token
const checkToken = async function(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY;
  
    if (!token) {
        console.log('notoken');
        return res.status(401).json({
            success: false,
            message: 'Authorization header missing, unauthorized access',
        });
    }
  
    try {
        const secretID = token;
        const jwtToken = await client.get(secretID);

        const decodedToken = jwt.verify(jwtToken, secretKey);

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired. Please re-authenticate.',
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.',
            });
        }
    }
};

// Middleware to check if the user is an admin
const isAdmin = function(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Admins only',
        });
    }
};
module.exports = {
    checkToken,
    isAdmin,
};
