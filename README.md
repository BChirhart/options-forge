# OptionsForge

A Next.js learning platform for options trading, deployed on Firebase.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project is deployed on **Firebase Hosting** with **Firebase Functions** for server-side rendering.

### Deploy to Firebase

Deploy everything (functions + hosting):
```bash
npm run deploy
```

Deploy only hosting (faster, for static changes):
```bash
npm run deploy:hosting
```

The app is live at: https://options-forge.web.app

### Important Notes

- **This project is deployed exclusively on Firebase** - not Vercel
- If you have Vercel auto-deployment enabled via GitHub integration, please disconnect it to avoid conflicts
- Full deployments (`npm run deploy`) take longer because they rebuild and deploy Cloud Functions
- Use `deploy:hosting` for faster deployments when only making UI/content changes

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Hosting**: Firebase Hosting
- **Backend**: Firebase Functions (Cloud Run)
- **Database**: Firestore
- **Authentication**: Firebase Auth (Google Sign-in)
- **Styling**: TailwindCSS

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
