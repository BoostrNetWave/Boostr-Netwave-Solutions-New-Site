function isValidVideoUrl(url) {
  if (!url) return true; // empty is allowed — means "no video"
  try {
    const parsed = new URL(url);
    const allowedHosts = ['youtube.com', 'www.youtube.com', 'youtu.be', 'vimeo.com', 'www.vimeo.com'];
    return allowedHosts.includes(parsed.hostname);
  } catch {
    return false;
  }
}

module.exports = { isValidVideoUrl };
