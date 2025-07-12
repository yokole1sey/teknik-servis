module.exports = {
  apps: [
    {
      name: 'kariyer-backend',
      script: './server.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3001,
        CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://yourdomain.com'
      },
      // Yeniden başlatma ayarları
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '200M',
      
      // Log ayarları
      log_file: './logs/app.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Monitoring
      monitoring: false,
      
      // Process ayarları
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 3000,
      
      // Auto restart ayarları
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'upload'],
      
      // Cron restart (Her gün gece 2'de restart)
      cron_restart: '0 2 * * *',
      
      // Merge logs
      merge_logs: true,
      
      // Source map support
      source_map_support: true
    }
  ]
}; 