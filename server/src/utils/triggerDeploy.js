const axios = require('axios');
const { logger } = require('./logger');

/**
 * Trigger a Vercel deployment by hitting the Deploy Hook URL.
 * This should be called after a content entity (e.g. Blog, Service) is created, updated, or deleted,
 * to ensure that the static frontend (and its sitemap) is rebuilt with the fresh data.
 */
async function triggerVercelDeploy() {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hookUrl) {
    logger.warn('VERCEL_DEPLOY_HOOK_URL is not set. Skipping Vercel deployment trigger.');
    return;
  }

  try {
    // Vercel deploy hooks expect a POST request.
    const response = await axios.post(hookUrl);
    logger.info(`Vercel deployment triggered successfully. Status: ${response.status}`);
  } catch (error) {
    logger.error(`Failed to trigger Vercel deployment: ${error.message}`);
  }
}

module.exports = { triggerVercelDeploy };
