const express = require('express');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// Memory storage — files never touch disk
const storage = multer.memoryStorage();

// Allowed MIME types for uploads
const IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
];
const VIDEO_TYPES = ['video/mp4', 'video/webm'];
const ALLOWED_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];

// Max sizes: 10 MB for images/docs, 200 MB for video
const MAX_SIZE_IMAGE = 10 * 1024 * 1024;
const MAX_SIZE_VIDEO = 200 * 1024 * 1024;

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE_VIDEO }, // multer enforces a single limit; we re-check per type below
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}. Allowed: JPEG, PNG, GIF, WEBP, SVG, PDF, MP4, WEBM.`));
    }
  },
});

// Multer error handler — catches fileFilter and size limit errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message?.includes('File type not allowed')) {
    return res.status(400).json({ success: false, statusCode: 400, message: err.message });
  }
  next(err);
};

// Separate video MIME check helper
const isVideoType = (mime) => VIDEO_TYPES.includes(mime);

router.post(
  '/',
  protect,
  restrictTo('superadmin', 'editor'),
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, 'No file provided.');
    }

    // Per-type size enforcement (multer limit above allows up to video max; re-check for images)
    const isVideo = isVideoType(req.file.mimetype);
    const maxSize = isVideo ? MAX_SIZE_VIDEO : MAX_SIZE_IMAGE;
    if (req.file.size > maxSize) {
      throw new ApiError(400, `File too large. Max size: ${isVideo ? '200MB for video' : '10MB for images'}.`);
    }

    // Deep content validation using magic-byte inspection
    // SVG, PDF, and video formats are text-based or not reliably detected — skip for those types
    let fileType;
    if (!isVideo && !['image/svg+xml', 'application/pdf'].includes(req.file.mimetype)) {
      try {
        const { fileTypeFromBuffer } = await import('file-type');
        fileType = await fileTypeFromBuffer(req.file.buffer);
      } catch (e) {
        fileType = null;
      }

      // For binary formats, verify the actual content matches the declared mime type
      if (fileType && !IMAGE_TYPES.includes(fileType.mime)) {
        throw new ApiError(400, `File content does not match declared type. Detected: ${fileType.mime}`);
      }
    }

    // Convert buffer to base64 for Cloudinary upload
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

    // Upload to Cloudinary using server-side API keys (secure)
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'boostrnetwave',
      resource_type: 'auto',
    });

    res.status(200).json(new ApiResponse(200, { url: result.secure_url }, 'File uploaded successfully'));
  }),
  handleMulterError
);

module.exports = router;
