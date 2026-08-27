require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const T = require('./src/models/Testimonial');
  
  // Delete the 3 fake-named ones
  const fakeNames = ['Ravi Kumar', 'Priya Sharma', 'Ankit Patel'];
  const result = await T.deleteMany({ name: { $in: fakeNames } });
  console.log('Deleted fake testimonials:', result.deletedCount);

  // Insert proper placeholders that clearly indicate they need to be replaced by admin
  const placeholders = [
    {
      name: '[Add Client Name]',
      role: '[Add Role, e.g. CEO]',
      company: '[Add Company Name]',
      quote: 'Add a real testimonial from your client here. Log into Admin Panel > Testimonials to replace this placeholder.',
      rating: 5,
      order: 1,
      isVisible: true
    },
    {
      name: '[Add Client Name]',
      role: '[Add Role, e.g. CTO]',
      company: '[Add Company Name]',
      quote: 'Add a real testimonial from your client here. Log into Admin Panel > Testimonials to replace this placeholder.',
      rating: 5,
      order: 2,
      isVisible: true
    },
    {
      name: '[Add Client Name]',
      role: '[Add Role, e.g. Director]',
      company: '[Add Company Name]',
      quote: 'Add a real testimonial from your client here. Log into Admin Panel > Testimonials to replace this placeholder.',
      rating: 5,
      order: 3,
      isVisible: true
    }
  ];
  const inserted = await T.insertMany(placeholders);
  console.log('Inserted placeholder testimonials:', inserted.length);
  mongoose.disconnect();
}).catch(e => console.error(e));
