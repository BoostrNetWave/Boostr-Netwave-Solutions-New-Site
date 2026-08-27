const mongoose = require('mongoose');

/**
 * Product — proprietary tools/SaaS products OWNED by Boostr Netwave.
 * e.g. Makeauthority, Adethix, Thecloudpi, Thetalentsprout
 * Distinct from ClientProject (work done for others).
 */
const productSchema = new mongoose.Schema({
  title:            { type: String, required: true, trim: true },
  slug:             { type: String, required: true, unique: true, lowercase: true, trim: true },
  tagline:          { type: String },                      // one-liner pitch
  description:      { type: String, required: true },
  longDescription:  { type: String },                      // full product page content
  logo:             { type: String },                      // product logo URL
  heroImage:        { type: String },                      // product screenshot/hero
  category:         { type: String },                      // e.g. "AI Tool", "SaaS Platform"
  status:           { type: String, enum: ['live', 'beta', 'coming-soon'], default: 'live' },
  liveUrl:          { type: String },
  features:         [{ type: String }],
  techStack:        [{ type: String }],
  order:            { type: Number, default: 0 },
  isVisible:        { type: Boolean, default: true },
  seoTitle:         { type: String, trim: true },
  seoDescription:   { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
