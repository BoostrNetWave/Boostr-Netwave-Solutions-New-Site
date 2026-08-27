const mongoose = require('mongoose');

// Flexible key-value store for all site-wide settings
// e.g. company name, social links, hero text, SEO meta, etc.
const siteSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  group: { type: String, default: 'general' },  // general | seo | social | contact
  label: { type: String },                       // human-readable label for the admin UI
  type: { type: String, enum: ['text', 'textarea', 'image', 'url', 'boolean', 'json'], default: 'text' },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
