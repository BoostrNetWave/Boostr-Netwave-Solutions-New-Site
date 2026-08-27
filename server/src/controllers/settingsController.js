const SiteSettings = require('../models/SiteSettings');
const { ApiResponse } = require('../utils/ApiResponse');
const { ApiError } = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { isValidVideoUrl } = require('../utils/validateVideoUrl');

// GET /api/settings  (public — returns all settings as a flat key-value map)
const getAll = asyncHandler(async (_req, res) => {
  const rows = await SiteSettings.find();
  const map = {};
  rows.forEach(row => { map[row.key] = row.value; });
  res.json(new ApiResponse(200, map));
});

// GET /api/admin/settings  (admin — returns full documents with metadata)
const getAllAdmin = asyncHandler(async (_req, res) => {
  const settings = await SiteSettings.find().sort('group key');
  res.json(new ApiResponse(200, settings));
});

// PUT /api/admin/settings/:key  (admin — upsert a setting)
const upsert = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { value, group, label, type } = req.body;

  if (key === 'homepageVideoUrl' && !isValidVideoUrl(value)) {
    throw new ApiError(400, 'Invalid video URL. Only YouTube and Vimeo are supported.');
  }

  const setting = await SiteSettings.findOneAndUpdate(
    { key },
    { value, group, label, type },
    { new: true, upsert: true, runValidators: true }
  );

  res.json(new ApiResponse(200, setting, 'Setting saved.'));
});

// PUT /api/admin/settings/bulk  (admin — update many settings at once)
const bulkUpsert = asyncHandler(async (req, res) => {
  const { settings } = req.body; // Array of { key, value, group?, label?, type? }
  if (!Array.isArray(settings)) throw new ApiError(400, '"settings" must be an array.');

  for (const s of settings) {
    if (s.key === 'homepageVideoUrl' && !isValidVideoUrl(s.value)) {
      throw new ApiError(400, 'Invalid video URL. Only YouTube and Vimeo are supported.');
    }
  }

  const ops = settings.map(({ key, value, group, label, type }) => ({
    updateOne: {
      filter: { key },
      update: { $set: { value, group, label, type } },
      upsert: true,
    },
  }));

  await SiteSettings.bulkWrite(ops);
  res.json(new ApiResponse(200, null, `${settings.length} settings saved.`));
});

module.exports = { getAll, getAllAdmin, upsert, bulkUpsert };
