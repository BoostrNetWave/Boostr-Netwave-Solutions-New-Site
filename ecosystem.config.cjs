/**
 * PM2 Ecosystem Config — Boostr Netwave Solutions
 *
 * PURPOSE:
 *   PM2 is a process manager for Node.js. It keeps the backend server running
 *   in the background, restarts it automatically if it crashes, and ensures
 *   it starts again automatically after a server reboot.
 *
 * HOW TO USE (on the production server):
 *
 *   First-time start:
 *     pm2 start ecosystem.config.cjs --env production
 *
 *   Save the process list (so PM2 restores it after reboot):
 *     pm2 save
 *
 *   Enable auto-start on server boot (run the command it prints):
 *     pm2 startup
 *
 *   Other useful commands:
 *     pm2 status                          → See if the server is running
 *     pm2 logs boostrnetwave-api          → View live logs
 *     pm2 restart boostrnetwave-api       → Restart after a code update
 *     pm2 stop boostrnetwave-api          → Stop the server
 *
 * IMPORTANT — why instances: 1 (not 'max'):
 *   The backend uses node-cache for in-memory caching. node-cache lives
 *   inside a single Node process. If PM2 cluster mode (instances: 'max')
 *   is used, each worker would have its own separate cache, and clearing
 *   the cache in one worker would not clear it in others. This would cause
 *   stale data to appear after admin updates. Keep instances: 1 unless
 *   the cache is migrated to Redis.
 */

module.exports = {
  apps: [{
    // ── App identity ──────────────────────────────────────────────────────────
    name: 'boostrnetwave-api',  // Name shown in 'pm2 status'
    cwd: './server',            // Run from the server/ directory
    script: 'server.js',        // Entry point

    // ── Cluster mode WARNING — read comment above before changing ─────────────
    instances: 1,
    exec_mode: 'fork',          // 'fork' = single process (safe with node-cache)

    // ── Production environment variables ──────────────────────────────────────
    // These are merged with the server/.env file at runtime.
    // The .env file is the primary source of secrets — do not put secrets here.
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
    },

    // ── Auto-restart settings ─────────────────────────────────────────────────
    // Restart if memory exceeds 512MB (catches memory leaks)
    max_memory_restart: '512M',
    // Wait 3 seconds between crash restarts (avoids rapid restart loops)
    restart_delay: 3000,
    // Give up after 10 restarts in a row (prevents infinite crash loops)
    max_restarts: 10,

    // ── Log files ─────────────────────────────────────────────────────────────
    // These are in addition to the Winston log files inside server/logs/
    out_file: './server/logs/pm2-out.log',
    error_file: './server/logs/pm2-error.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }],
};
