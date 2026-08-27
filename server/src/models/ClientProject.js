const mongoose = require('mongoose');

/**
 * ClientProject — work done FOR other clients (case studies / showcases).
 * Distinct from Product (proprietary tools owned by Boostr Netwave).
 */
const clientProjectSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  category:    { type: String, required: true },           // e.g. "E-commerce", "EdTech"
  client:      { type: String },                           // client company name
  location:    { type: String },
  description: { type: String, required: true },
  challenge:   { type: String },                           // the problem we solved
  solution:    { type: String },                           // what we built
  result:      { type: String },                           // measurable outcome
  clientQuote: { type: String },                           // a quote from the client
  image:       { type: String },                           // hero/screenshot URL
  techStack:   [{ type: String }],
  liveUrl:     { type: String },
  isFeatured:  { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
  isVisible:   { type: Boolean, default: true },
  seoTitle:    { type: String, trim: true },
  seoDescription: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('ClientProject', clientProjectSchema);
