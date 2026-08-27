const ClientProject = require('../models/ClientProject');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getAll = asyncHandler(async (_req, res) => {
  const projects = await ClientProject.find({ isVisible: true }).sort('order -createdAt');
  res.json(new ApiResponse(200, projects));
});

const getFeatured = asyncHandler(async (_req, res) => {
  const projects = await ClientProject.find({ isVisible: true, isFeatured: true }).sort('order');
  res.json(new ApiResponse(200, projects));
});

const getOne = asyncHandler(async (req, res) => {
  let isVisibleQuery = true;
  if (req.query.preview === '1') {
    const token = req.cookies?.jwt;
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        jwt.verify(token, process.env.JWT_SECRET);
        isVisibleQuery = false;
      } catch (err) {}
    }
  }

  const query = { slug: req.params.slug };
  if (isVisibleQuery) query.isVisible = true;

  const project = await ClientProject.findOne(query);
  if (!project) throw new ApiError(404, 'Project not found.');
  res.json(new ApiResponse(200, project));
});

const create = asyncHandler(async (req, res) => {
  const project = await ClientProject.create(req.body);
  res.status(201).json(new ApiResponse(201, project, 'Project created.'));
});

const update = asyncHandler(async (req, res) => {
  const project = await ClientProject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!project) throw new ApiError(404, 'Project not found.');
  res.json(new ApiResponse(200, project, 'Project updated.'));
});

const remove = asyncHandler(async (req, res) => {
  const project = await ClientProject.findByIdAndDelete(req.params.id);
  if (!project) throw new ApiError(404, 'Project not found.');
  res.json(new ApiResponse(200, null, 'Project deleted.'));
});

module.exports = { getAll, getFeatured, getOne, create, update, remove };
