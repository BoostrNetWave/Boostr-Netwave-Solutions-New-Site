const mongoose = require('mongoose');

const contactLeadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  company: { type: String, trim: true },
  service: { type: String },
  budget: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied', 'archived'], default: 'new' },
  ipAddress: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ContactLead', contactLeadSchema);
