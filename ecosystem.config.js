module.exports = {
  apps: [
    {
      name: 'Nest TypeScript Starter Template',
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
