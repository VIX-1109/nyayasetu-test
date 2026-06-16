const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  webpack: (config) => {
    // Files pulled in from the sibling backend/ dir (via externalDir) import
    // bare npm packages like 'openai'. Node/webpack would resolve those
    // relative to backend/ (which has no node_modules), so add the frontend's
    // node_modules as a resolution root.
    config.resolve.modules.push(path.resolve(__dirname, 'node_modules'));
    return config;
  },
};

module.exports = nextConfig;
