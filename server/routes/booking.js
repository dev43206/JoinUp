const jwt = require('jsonwebtoken');
const user = require('../models/User');



// user authentication middleware to protect routes

const protect = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null;

    if (!token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await user.findById(decoded.id).select('-password');
            if(!req.user) {
                return res.status(401).json({ error: 'Please verify your email to access this resource' });
            }
            next();
            
        } catch (error) {
            return res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }
    else {     
           return res.status(401).json({ error: 'Not authorized, no token' });
    }

    
};


const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();     
    } else {
        return res.status(403).json({ message: 'Access denied, admin only' });
    }
};

module.exports = {
    protect,
    admin
};