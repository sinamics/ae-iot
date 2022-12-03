/** @type {import('next').NextConfig} */
// const MqttConnect = require('./lib/mqtt.js');
const nextConfig = {
  experimental: {
    appDir: true,
  },
};

module.exports = (phase) => {
  // console.log('Starting at phase:', phase);
  // MqttConnect();
  return nextConfig;
};
