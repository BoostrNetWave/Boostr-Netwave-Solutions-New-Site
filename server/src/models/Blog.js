const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },   // rich HTML/markdown
  coverImage: { type: String },
  imageAlt: { type: String, default: '' },
  author: { type: String, default: 'Boostr Netwave Team' },
  tags: [{ type: String }],
  category: { type: String },
  readTime: { type: Number, default: 5 },      // minutes
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  seoTitle: { type: String, trim: true },
  seoDescription: { type: String, trim: true }
}, { timestamps: true });

// Auto-set publishedAt when isPublished flips to true
blogSchema.pre('save', async function () {
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});


module.exports = mongoose.model('Blog', blogSchema);
