// This file configures Sentry for Edge Runtime (Vercel Edge Functions)
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'production',
  
  // Performance Monitoring
  tracesSampleRate: 0.1, // 10% of transactions
  
  // Error Filtering
  ignoreErrors: [
    'AbortError',
    'TimeoutError',
  ],
});

export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;
