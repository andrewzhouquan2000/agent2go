// This file configures Sentry for the server (Node.js runtime)
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'production',
  
  // Performance Monitoring
  tracesSampleRate: 0.1, // 10% of transactions
  
  // Profiling
  profilesSampleRate: 0.1, // 10% of profiles
  
  // Error Filtering
  ignoreErrors: [
    // Database errors (handled separately)
    'ECONNREFUSED',
    'ETIMEDOUT',
    
    // Expected validation errors
    'ValidationError',
    'PrismaClientValidationError',
  ],
  
  // Before sending event to Sentry
  beforeSend(event, hint) {
    // Add custom context for server errors
    if (event.exception) {
      // Add server-specific tags
      event.tags = {
        ...event.tags,
        runtime: 'nodejs',
        platform: process.platform,
      };
    }
    
    return event;
  },
  
  // Integrations for Node.js
  integrations: [
    // Add any Node.js specific integrations if needed
  ],
  
  // Attach stack traces
  attachStacktrace: true,
  
  // Max breadcrumbs
  maxBreadcrumbs: 100,
});

// Export for use in API routes
export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;
export const setContext = Sentry.setContext;
export const setUser = Sentry.setUser;
export const startTransaction = Sentry.startTransaction;
