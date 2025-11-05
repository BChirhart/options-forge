const { onRequest } = require('firebase-functions/v2/https');
const path = require('path');
const next = require('next');

// Ensure process.env exists
if (!process.env) {
  process.env = {};
}

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

