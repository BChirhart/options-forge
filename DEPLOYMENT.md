# Firebase Hosting Deployment Guide

## Current Status

⚠️ **Note**: The app currently uses nested dynamic routes (`/levels/[levelId]/courses/[courseId]/lessons/[lessonId]`), which makes static export challenging. The build succeeds without static export, but Firebase Hosting requires static files.

## Deployment Options

### Option 1: Firebase Hosting with Cloud Functions (Recommended for Production)

For full Next.js support with SSR and dynamic routes:

1. **Install Firebase Functions dependencies**:
   ```bash
   npm install firebase-functions@latest firebase-admin@latest
   ```

2. **Use Firebase Functions for Next.js** - This requires additional setup. See [Firebase Next.js documentation](https://firebase.google.com/docs/hosting/frameworks/nextjs)

### Option 2: Static Export (Current Build Works)

The build currently works without static export. To deploy to Firebase Hosting with static files, you'll need to:

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Deploy the `.next` folder** (Note: This is a workaround - Firebase Hosting expects static files)

   Update `firebase.json` to point to the static export directory once we resolve the nested dynamic routes issue.

### Option 3: Manual Static File Deployment

If you want to use static export, you'll need to either:
- Pre-generate all routes at build time using Firebase Admin SDK
- Use catch-all routes instead of nested dynamic routes

## Current Configuration

- **Firebase Project ID**: `options-forge`
- **Build Output**: `.next` folder
- **Firebase Hosting**: Configured to serve from `.next` (may need adjustment)

## Prerequisites

1. **Firebase CLI** - Already installed (v14.15.2) ✅

2. **Login to Firebase** - Already logged in ✅

3. **Project Configuration** - Already set up ✅

## Environment Variables

Make sure you have a `.env.local` file with:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=options-forge
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Next Steps

To fully deploy to Firebase Hosting with nested dynamic routes, we need to:
1. Either use Firebase Functions for Next.js (recommended)
2. Or refactor routes to use catch-all patterns
3. Or pre-generate all routes at build time

The current build works, but Firebase Hosting needs static files or Cloud Functions setup.

