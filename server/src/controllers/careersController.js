const Career = require('../models/Career');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (_req, res) => {
  const careers = await Career.find({ $or: [{ isActive: true }, { isOpen: true }] }).sort('-createdAt');
  res.json(new ApiResponse(200, careers));
});

const getOne = asyncHandler(async (req, res) => {
  const job = await Career.findOne({ slug: req.params.slug, $or: [{ isActive: true }, { isOpen: true }] });
  if (!job) throw new ApiError(404, 'Job listing not found.');
  res.json(new ApiResponse(200, job));
});

const getAllAdmin = asyncHandler(async (_req, res) => {
  const careers = await Career.find().sort('-createdAt');
  res.json(new ApiResponse(200, careers));
});

const create = asyncHandler(async (req, res) => {
  const job = await Career.create(req.body);
  res.status(201).json(new ApiResponse(201, job, 'Job listing created.'));
});

const update = asyncHandler(async (req, res) => {
  const job = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!job) throw new ApiError(404, 'Job listing not found.');
  res.json(new ApiResponse(200, job, 'Job listing updated.'));
});

const remove = asyncHandler(async (req, res) => {
  const job = await Career.findByIdAndDelete(req.params.id);
  if (!job) throw new ApiError(404, 'Job listing not found.');
  res.json(new ApiResponse(200, null, 'Job listing deleted.'));
});

module.exports = { getAll, getOne, getAllAdmin, create, update, remove };
