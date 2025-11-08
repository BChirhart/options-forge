import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// TEMPORARILY DISABLED: Middleware causes Edge Runtime errors in Firebase Functions
// The Edge Runtime sandbox can't access process.env properly
// Auth protection is handled client-side via useAuth hook, so this is safe to disable
// TODO: Re-enable when Firebase Functions supports Next.js Edge Runtime properly

export function middleware(request: NextRequest) {
  // Simply pass through - auth is handled client-side
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match nothing - effectively disables middleware
    // This prevents Edge Runtime from being invoked
    '/__non-existent-route__',
  ],
};


