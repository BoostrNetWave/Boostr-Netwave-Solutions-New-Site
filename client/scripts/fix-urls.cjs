const fs = require('fs');

const files = [
  'src/pages/public/Team.jsx',
  'src/pages/public/Services.jsx',
  'src/pages/public/ServiceDetail.jsx',
  'src/pages/public/Products.jsx',
  'src/pages/public/ProductDetail.jsx',
  'src/pages/public/CaseStudyDetail.jsx',
  'src/pages/public/CaseStudies.jsx',
  'src/pages/public/Careers.jsx',
  'src/pages/public/CareerDetail.jsx',
  'src/pages/public/BlogDetail.jsx',
  'src/pages/public/Blog.jsx',
  'src/pages/public/About.jsx',
];

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  if (!c.includes('localhost:5000')) return;

  // Add import if not already there
  if (!c.includes('import API_BASE')) {
    // Insert after the last existing import line
    c = c.replace(
      /(import[^\n]+\n)(?!import)/,
      '$1import API_BASE from \'../../config/api\';\n'
    );
  }

  // Replace all variations of the hardcoded URL
  c = c.replace(/['`]http:\/\/localhost:5000\/api\/([^'`\n]+)['`]/g, '`${API_BASE}/$1`');

  fs.writeFileSync(f, c, 'utf8');
  console.log('Fixed: ' + f);
});
console.log('Done!');
