/**
 * db/seed.js — Database Seeder
 * Run: npm run seed
 * Safe to run multiple times — uses upsert (won't duplicate).
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');

const Service = require('../models/Service');
const Product = require('../models/Product');
const ClientProject = require('../models/ClientProject');
const Gallery = require('../models/Gallery');
const SiteSettings = require('../models/SiteSettings');
const Testimonial = require('../models/Testimonial');
const TeamMember = require('../models/TeamMember');

// ─── Seed Data ────────────────────────────────────────────────────────────────

const services = [
  { title: 'Software Development', slug: 'software-development', shortDescription: 'We develop intuitive, scalable SaaS applications that streamline operations and boost productivity.', longDescription: 'From project management tools to CRM systems and e-commerce platforms, our solutions meet unique client needs, ensuring seamless user experiences and driving business growth.', icon: 'fa-code', image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_f76e359734_4dbd31bdc3d329ad.png', order: 1 },
  { title: 'Digital Marketing', slug: 'digital-marketing', shortDescription: 'We craft tailored digital marketing strategies to boost engagement, visibility, and conversions.', longDescription: 'Our expertise spans SEO, social media, content creation, and email campaigns, connecting businesses with their target audience effectively.', icon: 'fa-bullhorn', image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_bcc47843be_38dede8dde15b01d.png', order: 2 },
  { title: 'AI Agent Automations', slug: 'ai-agent-automations', shortDescription: 'Our AI and ML experts build intelligent agents that do more than just talk—they work.', longDescription: 'From handling customer queries to automating daily tasks, we build intelligent agents that boost efficiency, reduce workload, and help your business run 24/7—smarter, faster, and better.', icon: 'fa-brain', image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_06fe16a70e_eb26336c943a52ec.png', order: 3 },
  { title: 'Cloud Deployment', slug: 'cloud-deployment', shortDescription: 'Ensure scalability, flexibility, and security with our comprehensive cloud services.', longDescription: 'From migrating existing infrastructure to building cloud-native applications, we offer end-to-end solutions tailored to your needs. With expertise in AWS, Azure, and Google Cloud.', icon: 'fa-cloud-bolt', image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_1ffd08632a_832682cabf976309.png', order: 4 },
];

// ✅ Proprietary tools owned by Boostr Netwave
const products = [
  { title: 'Makeauthority', slug: 'makeauthority', tagline: 'Build authority in your niche.', description: 'A platform to help businesses establish thought leadership and digital authority.', category: 'SaaS Platform', status: 'live', order: 1 },
  { title: 'Adethix', slug: 'adethix', tagline: 'Ethical advertising, reimagined.', description: 'An ad platform focused on transparent, performance-driven advertising solutions.', category: 'Ad Platform', status: 'live', order: 2 },
  { title: 'Thecloudpi', slug: 'thecloudpi', tagline: 'Cloud infrastructure, simplified.', description: 'Managed cloud infrastructure for startups and SMEs — zero DevOps expertise required.', category: 'Cloud Tool', status: 'live', order: 3 },
  { title: 'Thetalentsprout', slug: 'thetalentsprout', tagline: 'Grow the right talent.', description: 'An HR and talent development platform for SMEs to hire, train, and retain talent.', category: 'HR Platform', status: 'live', order: 4 },
];

// ✅ Work done FOR clients (case studies)
const clientProjects = [
  { title: 'Flowtransact', slug: 'flowtransact', category: 'FinTech', client: 'Flowtransact', location: 'Bhubaneswar', description: 'Green energy payment and transaction platform.', isFeatured: true, order: 1 },
  { title: 'Ushadaya', slug: 'ushadaya', category: 'Retail', client: 'Ushadaya', location: 'Hyderabad', description: 'Full-stack retail chain management platform for Hyderabad & Telangana.', isFeatured: true, order: 2 },
  { title: 'Toastmasters Bhubaneswar', slug: 'toastmasters-bhubaneswar', category: 'Community', client: 'Toastmasters', location: 'Bhubaneswar', description: 'Workforce skills development and community management platform.', isFeatured: false, order: 3 },
  { title: 'Place of Tourism', slug: 'place-of-tourism', category: 'Travel', client: 'Place of Tourism', location: 'Bhubaneswar, India', description: 'Travel and tourism news and discovery platform.', isFeatured: false, order: 4 },
  { title: 'Learner', slug: 'learner', category: 'EdTech', client: 'Learner', location: 'Bhubaneswar, India', description: 'Student learning and course management platform.', isFeatured: true, order: 5 },
  { title: 'Beezinfo', slug: 'beezinfo', category: 'Business Directory', client: 'Beezinfo', location: 'Bhubaneswar, India', description: 'Local and national business directory and listing platform.', isFeatured: false, order: 6 },
];

const galleryItems = [
  { 
    title: 'Odisha Startup Carnival 2024',
    date: new Date('2024-12-21'),
    location: 'AIC Nalanda, Bhubaneswar',
    category: 'Awards', 
    description: 'Boostr Netwave Solutions is honored to receive industry recognition and prestigious event honors.',
    images: [
      { url: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_78377d8bc7_ec8ae4a53f608cbd.png', alt: 'Startup Product Showcasing' },
      { url: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_efe9877da7_c2f396faa9ae96e3.png', alt: 'Team at Booth' }
    ],
    isFeatured: true,
    order: 1 
  },
  { 
    title: 'Company Culture & Events',
    category: 'Culture', 
    description: 'Building a dynamic and inclusive work environment.',
    images: [
      { url: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_7895b50e1f_bdce3e396a9f9500.png', alt: 'Team Events' },
      { url: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_b05041dc0d_daba6e2085450f29.png', alt: 'Engineering discussions' }
    ],
    isFeatured: false,
    order: 2 
  },
];

const siteSettings = [
  { key: 'company.name', value: 'BOOSTR NETWAVE SOLUTIONS Pvt Ltd', group: 'general', label: 'Company Name', type: 'text' },
  { key: 'company.shortName', value: 'Boostr Netwave', group: 'general', label: 'Short Name', type: 'text' },
  { key: 'company.location', value: 'Bhubaneswar, Odisha, India', group: 'contact', label: 'Office Location', type: 'text' },
  { key: 'company.phone', value: '+91 955-667-9622', group: 'contact', label: 'Phone', type: 'text' },
  { key: 'company.email', value: 'contact@boostrnetwave.com', group: 'contact', label: 'Email', type: 'text' },
  { key: 'company.gst', value: '21AAMCB0107E1ZH', group: 'general', label: 'GST Number', type: 'text' },
  { key: 'hero.eyebrow', value: 'BHUBANESWAR · INDIA', group: 'homepage', label: 'Hero Eyebrow Tag', type: 'text' },
  { key: 'hero.heading', value: 'Build What Moves Your Business Forward.', group: 'homepage', label: 'Hero Heading', type: 'text' },
  { key: 'hero.supportingText', value: 'We design, build, and deploy transformative software, AI systems, and cloud infrastructure for businesses aiming for digital growth.', group: 'homepage', label: 'Hero Supporting Text', type: 'textarea' },
  { key: 'hero.primaryCta', value: 'Start a Project', group: 'homepage', label: 'Primary CTA Text', type: 'text' },
  { key: 'hero.secondaryCta', value: 'Explore Services', group: 'homepage', label: 'Secondary CTA Text', type: 'text' },
  { key: 'about.heading', value: 'Technology Built Around Real Business Outcomes.', group: 'homepage', label: 'About Section Heading', type: 'text' },
  { key: 'about.description', value: 'BOOSTR NETWAVE SOLUTIONS Pvt Ltd is a leading provider of innovative digital solutions, specializing in digital marketing services, Software as a Service (SAAS) offerings, cutting-edge AI and ML application development, and cloud services.', group: 'homepage', label: 'About Description', type: 'textarea' },
  { key: 'stats.yearsExperience', value: '5+', group: 'homepage', label: 'Years of Experience', type: 'text' },
  { key: 'stats.happyClients', value: '90+', group: 'homepage', label: 'Happy Clients', type: 'text' },
  { key: 'stats.satisfaction', value: '100%', group: 'homepage', label: 'Satisfaction Rate', type: 'text' },
  { key: 'social.linkedin', value: 'https://linkedin.com/company/boostr-netwave', group: 'social', label: 'LinkedIn URL', type: 'url' },
  { key: 'social.twitter', value: 'https://twitter.com/boostrnetwave', group: 'social', label: 'Twitter / X URL', type: 'url' },
  { key: 'social.instagram', value: 'https://instagram.com/boostrnetwave', group: 'social', label: 'Instagram URL', type: 'url' },
  { key: 'social.youtube', value: 'https://youtube.com/@boostrnetwave', group: 'social', label: 'YouTube URL', type: 'url' },
  { key: 'seo.title', value: 'Boostr Netwave Solutions | Software, AI, Cloud & Digital Solutions', group: 'seo', label: 'Default Page Title', type: 'text' },
  { key: 'seo.description', value: 'BOOSTR NETWAVE SOLUTIONS Pvt Ltd is a leading provider of innovative digital solutions in Bhubaneswar, India.', group: 'seo', label: 'Default Meta Description', type: 'textarea' },
];

const testimonials = [
  { name: 'Ravi Kumar', role: 'CEO', company: 'Flowtransact', quote: 'Boostr Netwave transformed our business operations completely. Their team delivered beyond expectations.', rating: 5, order: 1 },
  { name: 'Priya Sharma', role: 'Director', company: 'Ushadaya Retail', quote: 'The digital platform they built for our retail chain has scaled seamlessly across Hyderabad and Telangana.', rating: 5, order: 2 },
  { name: 'Ankit Patel', role: 'Founder', company: 'Beezinfo', quote: 'Professional team, excellent communication, and a final product that exceeded our expectations.', rating: 5, order: 3 },
];

const teamMembers = [
  { name: 'Lingaraj Senapati', role: 'CTO and Senior Product Manager', image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_f76e359734_4dbd31bdc3d329ad.png', isLeadership: true, order: 1 },
  { name: 'Soumya Ranjan Mohapatra', role: 'AI and DevOps Consultant', image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_bcc47843be_38dede8dde15b01d.png', isLeadership: true, order: 2 },
  { name: 'Amrit Kumar Samal', role: 'CPO', image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_06fe16a70e_eb26336c943a52ec.png', isLeadership: true, order: 3 },
  { name: 'Ayan Azmi', role: 'Lead Developer, MakeAuthority', image: '', isLeadership: false, order: 4 },
];

// ─── Seed Function ────────────────────────────────────────────────────────────
const seed = async () => {
  console.log('🌱  Starting database seed...\n');
  await connectDB();

  for (const s of services) {
    await Service.findOneAndUpdate({ slug: s.slug }, s, { upsert: true, returnDocument: 'after' });
    console.log(`  ✅ Service: ${s.title}`);
  }

  // Clear old "client solutions" from Product collection, replace with real proprietary products
  await Product.deleteMany({});
  for (const p of products) {
    await Product.create(p);
    console.log(`  ✅ Product (proprietary): ${p.title}`);
  }

  for (const cp of clientProjects) {
    await ClientProject.findOneAndUpdate({ slug: cp.slug }, cp, { upsert: true, returnDocument: 'after' });
    console.log(`  ✅ Client Project: ${cp.title}`);
  }

  await Gallery.deleteMany({});
  await Gallery.insertMany(galleryItems);
  console.log(`  ✅ Gallery: ${galleryItems.length} items seeded`);

  for (const s of siteSettings) {
    await SiteSettings.findOneAndUpdate({ key: s.key }, s, { upsert: true, returnDocument: 'after' });
  }
  console.log(`  ✅ Site Settings: ${siteSettings.length} keys seeded`);

  for (const t of testimonials) {
    await Testimonial.findOneAndUpdate({ name: t.name }, t, { upsert: true, returnDocument: 'after' });
    console.log(`  ✅ Testimonial: ${t.name}`);
  }

  for (const tm of teamMembers) {
    await TeamMember.findOneAndUpdate({ name: tm.name }, tm, { upsert: true, returnDocument: 'after' });
    console.log(`  ✅ Team Member: ${tm.name}`);
  }

  console.log('\n🎉  Seed complete! Schema is now correctly split.\n');
  console.log('   Products (proprietary): Makeauthority, Adethix, Thecloudpi, Thetalentsprout');
  console.log('   Client Projects (work done for clients): 6 projects\n');
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
