const Service = require('../models/Service');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/services  (public)
const getAll = asyncHandler(async (_req, res) => {
  const services = await Service.find({ isVisible: true }).sort('order');
  res.json(new ApiResponse(200, services));
});

// GET /api/services/admin/all (admin)
const getAllAdmin = asyncHandler(async (_req, res) => {
  const services = await Service.find().sort('order');
  res.json(new ApiResponse(200, services));
});

// GET /api/services/:slug  (public)
const getOne = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, isVisible: true });
  if (!service) throw new ApiError(404, 'Service not found.');
  res.json(new ApiResponse(200, service));
});

// POST /api/admin/services  (admin)
const create = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json(new ApiResponse(201, service, 'Service created.'));
});

// PATCH /api/admin/services/:id  (admin)
const update = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!service) throw new ApiError(404, 'Service not found.');
  res.json(new ApiResponse(200, service, 'Service updated.'));
});

// DELETE /api/admin/services/:id  (admin)
const remove = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) throw new ApiError(404, 'Service not found.');
  res.json(new ApiResponse(200, null, 'Service deleted.'));
});

module.exports = { getAll, getOne, getAllAdmin, create, update, remove };
