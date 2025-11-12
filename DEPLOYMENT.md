# Firebase Hosting Deployment Guide

## Current Status

✅ **Deployed**: The app is successfully deployed on Firebase Hosting with Firebase Functions (Cloud Run) for server-side rendering.

- **Live URL**: https://options-forge.web.app
- **Firebase Project**: `options-forge`
- **Deployment Method**: Firebase Hosting + Cloud Functions (2nd Gen)

## Deployment Commands

### Full Deployment (Functions + Hosting)
```bash
npm run deploy
```
This rebuilds the Next.js app, copies it to the functions directory, and deploys both Cloud Functions and Hosting. Takes longer (~5-10 minutes) but ensures everything is in sync.

### Hosting Only (Faster)
```bash
npm run deploy:hosting
```
Use this for quick deployments when you've only changed static assets or UI. Note: If you changed code that affects the Cloud Function, you'll need a full deployment.

## Important: Vercel Disconnection

⚠️ **If you see updates on your old Vercel site**, it means Vercel has GitHub integration enabled and is auto-deploying on every push.

**To disconnect from Vercel:**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your `options-forge` project
3. Go to **Settings** → **Git**
4. Click **Disconnect** or **Remove** the GitHub integration
5. Alternatively, delete the project entirely from Vercel

**This project should ONLY deploy to Firebase**, not Vercel.

## Current Configuration

- **Firebase Project ID**: `options-forge`
- **Build Output**: `.next` folder
- **Firebase Hosting**: Serves static assets from `.next`
- **Firebase Functions**: Serves Next.js app via Cloud Run (`nextjsFunc`)
- **Database**: Firestore
- **Authentication**: Firebase Auth

## How It Works

1. `npm run build` creates the Next.js build in `.next/`
2. Predeploy script copies `.next/` to `functions/.next/`
3. Firebase Functions packages the function with the Next.js build
4. Cloud Run serves the Next.js app for SSR and dynamic routes
5. Firebase Hosting serves static assets and proxies all requests to the Cloud Function

## Environment Variables

Environment variables are embedded at build time for `NEXT_PUBLIC_*` variables. Make sure your `.env.local` file has all required Firebase config:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=options-forge
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## Troubleshooting

### Changes not appearing on live site
- If you only ran `deploy:hosting`, try a full `npm run deploy` to update the Cloud Function
- Check Firebase Functions logs: `firebase functions:log`

### Deployment takes too long
- Full deployments are slower because they rebuild and deploy Cloud Functions
- Use `deploy:hosting` for static-only changes (but remember it won't update the Cloud Function)

### Still seeing Vercel deployments
- Check Vercel dashboard and disconnect GitHub integration
- Verify no Vercel CLI commands are being run
- Check GitHub Actions if you have CI/CD set up

