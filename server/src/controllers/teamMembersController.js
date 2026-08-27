const TeamMember = require('../models/TeamMember');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');

exports.getTeamMembers = asyncHandler(async (req, res) => {
  const teamMembers = await TeamMember.find().sort({ order: 1 });
  res.status(200).json(new ApiResponse(200, teamMembers, 'Team members retrieved'));
});

exports.getTeamMemberById = asyncHandler(async (req, res) => {
  const teamMember = await TeamMember.findById(req.params.id);
  if (!teamMember) throw new ApiError(404, 'Team member not found');
  res.status(200).json(new ApiResponse(200, teamMember, 'Team member retrieved'));
});

exports.createTeamMember = asyncHandler(async (req, res) => {
  const teamMember = await TeamMember.create(req.body);
  res.status(201).json(new ApiResponse(201, teamMember, 'Team member created'));
});

exports.updateTeamMember = asyncHandler(async (req, res) => {
  const teamMember = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!teamMember) throw new ApiError(404, 'Team member not found');
  res.status(200).json(new ApiResponse(200, teamMember, 'Team member updated'));
});

exports.deleteTeamMember = asyncHandler(async (req, res) => {
  const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
  if (!teamMember) throw new ApiError(404, 'Team member not found');
  res.status(200).json(new ApiResponse(200, null, 'Team member deleted'));
});
