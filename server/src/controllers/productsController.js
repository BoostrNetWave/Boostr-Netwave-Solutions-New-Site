const Product = require('../models/Product');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/products — all visible proprietary products
const getAll = asyncHandler(async (_req, res) => {
  const products = await Product.find({ isVisible: true }).sort('order');
  res.json(new ApiResponse(200, products));
});

const getAllAdmin = asyncHandler(async (_req, res) => {
  const products = await Product.find().sort('order');
  res.json(new ApiResponse(200, products));
});

const getOne = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isVisible: true });
  if (!product) throw new ApiError(404, 'Product not found.');
  res.json(new ApiResponse(200, product));
});

const create = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(new ApiResponse(201, product, 'Product created.'));
});

const update = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) throw new ApiError(404, 'Product not found.');
  res.json(new ApiResponse(200, product, 'Product updated.'));
});

const remove = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found.');
  res.json(new ApiResponse(200, null, 'Product deleted.'));
});

module.exports = { getAll, getAllAdmin, getOne, create, update, remove };
