const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, trim: true },
  company: { type: String, trim: true },
  quote: { type: String },   // primary field used by old seed data
  content: { type: String }, // alias — frontend reads quote || content
  image: { type: String },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
