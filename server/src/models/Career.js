const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  department: { type: String, required: true },
  location: { type: String, default: 'Bhubaneswar, Odisha, India' },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'], default: 'Full-time' },
  experience: { type: String },      // e.g. "2-4 years"
  description: { type: String, required: true },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  isActive: { type: Boolean, default: true },
  postedAt: { type: Date, default: Date.now },
  seoTitle: { type: String, trim: true },
  seoDescription: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Career', careerSchema);
