module.exports = {
  apps : [{
    name: 'frontend',
    script: 'npm',
    args: 'start',
    env: {
      NODE_OPTIONS: '--openssl-legacy-provider'
    }
  }]
};
