module.exports = {
  apps: [
    {
      name: 'dolphin-admin-nest',
      script: './dist/main.js',
      env_development: {
        NODE_ENV: 'development'
      },
      env_staging: {
        NODE_ENV: 'staging'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      max_memory_restart: '1452M',
      exec_mode: 'cluster',
      instances: 4,
      exp_backoff_restart_delay: 100,
      min_uptime: '5m',
      max_restarts: 5
    }
  ]
}
