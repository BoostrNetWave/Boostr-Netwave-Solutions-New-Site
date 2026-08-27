const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Career',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      maxlength: 254,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    linkedinUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    portfolioUrl: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    resumeUrl: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    coverLetter: {
      type: String,
      trim: true,
      maxlength: 3000,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'rejected', 'hired'],
      default: 'pending',
    },
    ipAddress: {
      type: String, // Store IP to help identify/block spam
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
