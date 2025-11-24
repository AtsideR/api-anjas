// Vercel serverless function wrapper for the Express app
const serverless = require('serverless-http');
const app = require('../src/index');

module.exports = serverless(app);
