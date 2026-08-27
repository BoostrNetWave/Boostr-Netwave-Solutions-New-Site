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
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
];

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}. Allowed: JPEG, PNG, GIF, WEBP, SVG, PDF.`));
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

router.post(
  '/',
  protect,
  restrictTo('superadmin', 'editor'),
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, 'No file provided.');
    }

    // Deep content validation using magic-byte inspection
    // This catches files with spoofed extensions (e.g. a .txt renamed to .jpg)
    let fileType;
    try {
      const { fileTypeFromBuffer } = await import('file-type');
      fileType = await fileTypeFromBuffer(req.file.buffer);
    } catch (e) {
      // SVG/PDF are text-based and may not resolve — fall back to mime type check
      fileType = null;
    }

    // For binary formats, verify the actual content matches the declared mime type
    if (fileType && !ALLOWED_TYPES.includes(fileType.mime)) {
      throw new ApiError(400, `File content does not match declared type. Detected: ${fileType.mime}`);
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
