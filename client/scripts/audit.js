import { preview } from 'vite';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

async function runAudit() {
  console.log('🚀 Starting Lighthouse Audit...');
  
  // Start Vite preview server programmatically
  console.log('Spinning up Vite preview server for auditing...');
  const previewServer = await preview({
    preview: { port: 4173 },
  });
  
  const PREVIEW_URL = previewServer.resolvedUrls.local[0];
  console.log(`Preview server running at ${PREVIEW_URL}`);

  const targets = [
    { name: 'home', path: '' },
    { name: 'services', path: 'services/software-development' },
    { name: 'blog', path: 'blog/saas-inbound-marketing' }
  ];

  for (const target of targets) {
    const url = `${PREVIEW_URL}${target.path}`;
    const reportPath = path.join(process.cwd(), `lighthouse-${target.name}.json`);
    
    console.log(`\n🔍 Auditing: ${url}`);
    
    try {
      // Run Lighthouse via npx
      execSync(`npx --yes lighthouse "${url}" --output json --output-path "${reportPath}" --chrome-flags="--headless"`, { stdio: 'inherit' });
      
      // Parse results
      const result = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      const scores = {
        Performance: Math.round(result.categories.performance.score * 100),
        Accessibility: Math.round(result.categories.accessibility.score * 100),
        'Best Practices': Math.round(result.categories['best-practices'].score * 100),
        SEO: Math.round(result.categories.seo.score * 100),
      };
      
      console.log(`\n✅ Scores for ${target.name}:`);
      console.table(scores);
      
    } catch (err) {
      console.error(`❌ Failed to audit ${target.name}:`, err.message);
    }
  }

  // Stop preview server
  previewServer.httpServer.close();
  console.log('\n🎉 Audit complete!');
}

runAudit();
