/**
 * TR7 Shop Builder — Configuration PM2
 * Usage: pm2 start ecosystem.config.js
 * Hostinger VPS deployment
 */
module.exports = {
  apps: [
    {
      name: 'tr7-shop-builder',
      script: './backend/server.js',
      cwd: '/home/user/tr7-skillshop-shopify',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3700
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    }
  ]
};
