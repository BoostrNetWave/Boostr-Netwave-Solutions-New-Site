const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const { ApiError } = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, _res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) throw new ApiError(401, 'Not authenticated. Please log in.');

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await AdminUser.findById(decoded.id).select('-password');
  if (!user || !user.isActive) throw new ApiError(401, 'Session expired or account deactivated.');

  req.user = user;
  req.sessionExp = decoded.exp * 1000;
  next();
});

const restrictTo = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to perform this action.'));
  }
  next();
};

module.exports = { protect, restrictTo };
