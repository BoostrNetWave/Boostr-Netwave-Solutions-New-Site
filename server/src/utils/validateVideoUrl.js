/**
 * isValidVideoUrl — URL allowlist for any setting that stores a video URL.
 *
 * Allowed:
 *  - Empty string / null / undefined  → always allowed (means "no video set")
 *  - YouTube  → youtube.com, www.youtube.com, youtu.be
 *  - Vimeo    → vimeo.com, www.vimeo.com
 *  - Cloudinary video files → res.cloudinary.com, but ONLY .mp4 or .webm paths
 *
 * Everything else is rejected — including raw links to third-party sites.
 * This function is shared by homepageVideoUrl (hero) and leadershipVideoUrl.
 */
function isValidVideoUrl(url) {
  if (!url) return true; // empty is allowed — means "no video"
  try {
    const parsed = new URL(url);

    const knownPlatforms = ['youtube.com', 'www.youtube.com', 'youtu.be', 'vimeo.com', 'www.vimeo.com'];
    if (knownPlatforms.includes(parsed.hostname)) return true;

    // Cloudinary self-hosted video — must be .mp4 or .webm, not just any Cloudinary asset
    if (parsed.hostname === 'res.cloudinary.com') {
      return /\.(mp4|webm)$/i.test(parsed.pathname);
    }

    return false; // reject anything else
  } catch {
    return false; // malformed URL
  }
}

module.exports = { isValidVideoUrl };
