const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String },
  icon: { type: String },            // icon class or SVG string
  image: { type: String },           // URL
  features: [{ type: String }],
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
  faqs: [{
    question: String,
    answer: String
  }],
  seoTitle: { type: String, trim: true },
  seoDescription: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
