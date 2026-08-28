const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  category: { type: String, default: 'Core Team' },
  image: { type: String }, // Optional initially, Cloudinary URL
  imageAlt: { type: String, default: '' },
  bio: { type: String },
  linkedin: { type: String },
  twitter: { type: String },
  isLeadership: { type: Boolean, default: false }, // Highlights CEO/CTO etc
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
