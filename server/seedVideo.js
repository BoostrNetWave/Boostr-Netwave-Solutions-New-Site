require('dotenv').config();
const mongoose = require('mongoose');
const SiteSettings = require('./src/models/SiteSettings');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await SiteSettings.updateOne(
    { key: 'homepageVideoUrl' },
    { $setOnInsert: { value: '', group: 'homepage', label: 'Leadership Video URL', type: 'url' } },
    { upsert: true }
  );
  console.log('Seeded homepageVideoUrl');
  process.exit(0);
}

seed();
