const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware with JWT verification
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Next middleware function
 */
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Missing or invalid authorization header' 
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT secret not configured');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' 
      ? 'Session expired, please login again'
      : 'Invalid authentication token';
      
    res.status(401).json({ error: message });
  }
};

module.exports = authenticate;