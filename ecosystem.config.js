module.exports = {
  apps: [
    {
      name: 'Dolphin Admin Nest API',
      script: './dist/main.js',
      max_memory_restart: '1452M',
      exec_mode: 'cluster',
      instances: 4,
      exp_backoff_restart_delay: 100,
      min_uptime: '5m',
      max_restarts: 5
    }
  ]
}
