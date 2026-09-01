const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password are required.');

  const user = await AdminUser.findOne({ email, isActive: true }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, 'Invalid credentials.');
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = signToken(user._id);
  const decoded = jwt.decode(token);
  const expiresAt = decoded.exp * 1000;
  
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isProd,                           // HTTPS only in prod
    sameSite: isProd ? 'none' : 'lax',        // 'none' required for cross-domain (Vercel <-> Render)
    maxAge: 7 * 24 * 60 * 60 * 1000,         // 7 days
  });

  res.json(new ApiResponse(200, { token, expiresAt, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Login successful.'));
});

// POST /api/auth/logout
const logout = asyncHandler(async (_req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  // Must pass the SAME attributes used when setting the cookie, or the browser ignores the clear
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 0, // Immediately expire
  });
  res.json(new ApiResponse(200, null, 'Logged out successfully.'));
});

const getMe = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, { user: req.user, expiresAt: req.sessionExp }, 'User fetched.'));
});

// POST /api/auth/register  (first-time setup only — disabled after first admin exists)
const register = asyncHandler(async (req, res) => {
  const count = await AdminUser.countDocuments();
  if (count > 0 && req.user?.role !== 'superadmin') {
    throw new ApiError(403, 'Registration is closed. Contact a superadmin.');
  }

  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 12);
  const user = await AdminUser.create({ name, email, password: hashed, role: count === 0 ? 'superadmin' : (role || 'editor') });

  const token = signToken(user._id);
  const decoded = jwt.decode(token);
  const expiresAt = decoded.exp * 1000;
  
  res.status(201).json(new ApiResponse(201, { token, expiresAt, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, 'Admin registered.'));
});

module.exports = { login, logout, getMe, register };
