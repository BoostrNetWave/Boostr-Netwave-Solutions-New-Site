module.exports = {
  apps: [{
    name: 'boostrnetwave-api',
    cwd: './server',
    script: 'server.js',
    // IMPORTANT: use instances: 1 (fork mode), NOT 'max' (cluster mode).
    // node-cache is in-memory — cluster mode would give each worker its own
    // cache, so cache.flushAll() in one worker wouldn't clear others.
    instances: 1,
    exec_mode: 'fork',
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
    },
    // Auto-restart on high memory usage
    max_memory_restart: '512M',
    // Delay between crash restarts — avoids rapid-fire restart loops
    restart_delay: 3000,
    max_restarts: 10,
    // Logging — logs live inside the server/logs dir alongside Winston logs
    out_file: './server/logs/pm2-out.log',
    error_file: './server/logs/pm2-error.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }],
};
