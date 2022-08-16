module.exports = {
  name: 'PARSEC-Client',
  script: 'serve',
  env_production: {
    PM2_SERVE_PATH: './public',
    PM2_SERVE_PORT: 8000
  },
  env_development: {
    PM2_SERVE_PATH: './public',
    PM2_SERVE_PORT: 8000,
    watch: true
  }
}
