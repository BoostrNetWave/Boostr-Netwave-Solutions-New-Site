const Blog = require('../models/Blog');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/blog  — all published posts, with pagination
const getAll = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Blog.find({ isPublished: true }).sort('-publishedAt').skip(skip).limit(limit).select('-content'),
    Blog.countDocuments({ isPublished: true }),
  ]);

  res.json(new ApiResponse(200, { posts, total, page, pages: Math.ceil(total / limit) }));
});

const getOne = asyncHandler(async (req, res) => {
  let isPublishedQuery = true;
  if (req.query.preview === '1') {
    const token = req.cookies?.jwt;
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        jwt.verify(token, process.env.JWT_SECRET);
        isPublishedQuery = false;
      } catch (err) {}
    }
  }

  const query = { slug: req.params.slug };
  if (isPublishedQuery) query.isPublished = true;

  const post = await Blog.findOne(query);
  if (!post) throw new ApiError(404, 'Post not found.');
  res.json(new ApiResponse(200, post));
});

// Admin — get ALL posts (including drafts)
const getAllAdmin = asyncHandler(async (_req, res) => {
  const posts = await Blog.find().sort('-createdAt').select('-content');
  res.json(new ApiResponse(200, posts));
});

const create = asyncHandler(async (req, res) => {
  const post = await Blog.create(req.body);
  res.status(201).json(new ApiResponse(201, post, 'Post created.'));
});

const update = asyncHandler(async (req, res) => {
  const post = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!post) throw new ApiError(404, 'Post not found.');
  res.json(new ApiResponse(200, post, 'Post updated.'));
});

const remove = asyncHandler(async (req, res) => {
  const post = await Blog.findByIdAndDelete(req.params.id);
  if (!post) throw new ApiError(404, 'Post not found.');
  res.json(new ApiResponse(200, null, 'Post deleted.'));
});

module.exports = { getAll, getOne, getAllAdmin, create, update, remove };
