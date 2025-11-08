const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  try {
    console.log('🔐 Auth middleware called');
    console.log('Headers:', req.headers);

    const token = req.header('x-auth-token');

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    console.log('✅ Token found:', token.substring(0, 30) + '...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified:', decoded);

    req.user = {
      id: decoded.user.id
    };

    console.log('👤 User ID extracted:', req.user.id);
    next();
  } catch (err) {
    console.error('❌ Auth error:', err.message);
    res.status(401).json({ msg: 'Token is not valid', error: err.message });
  }
};