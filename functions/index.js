const { onRequest } = require('firebase-functions/v2/https');
const path = require('path');
const next = require('next');

// CRITICAL: Ensure process.env exists globally before Next.js initializes
// This is required for Next.js Edge Runtime (used by middleware) to work
// Edge Runtime tries to access process.env.keys() which fails if it's null/undefined
if (typeof global.process === 'undefined') {
  global.process = require('process');
}
if (!global.process.env) {
  global.process.env = {};
}

// Ensure process.env is available in all contexts
// Next.js Edge Runtime needs this to be a proper object
Object.setPrototypeOf(global.process.env, Object.prototype);

// Initialize any missing env vars to prevent undefined errors
// NEXT_PUBLIC_* vars are embedded at build time, but Edge Runtime still needs process.env to exist
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
];

requiredEnvVars.forEach(key => {
  if (!global.process.env[key]) {
    global.process.env[key] = '';
  }
});

// Initialize Next.js server
// The .next folder should be in the functions directory after deployment
const nextjsServer = next({
  dev: false,
  conf: { 
    distDir: path.join(__dirname, '.next'),
  },
});

const nextjsHandle = nextjsServer.getRequestHandler();

// Prepare Next.js server
let nextjsReady = false;
let nextjsError = null;
const prepareNextjs = async () => {
  if (!nextjsReady && !nextjsError) {
    try {
      await nextjsServer.prepare();
      nextjsReady = true;
    } catch (error) {
      nextjsError = error;
      console.error('Error preparing Next.js:', error);
      throw error;
    }
  }
  if (nextjsError) {
    throw nextjsError;
  }
};

// Environment variables are embedded at build time for NEXT_PUBLIC_* variables
// They should be available in process.env when the function runs
exports.nextjsFunc = onRequest(
  {
    region: 'us-central1',
    memory: '1GiB',
    timeoutSeconds: 60,
  },
  async (req, res) => {
    try {
      await prepareNextjs();
      return nextjsHandle(req, res);
    } catch (error) {
      console.error('Error in nextjsFunc:', error);
      console.error('Stack:', error.stack);
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
);

