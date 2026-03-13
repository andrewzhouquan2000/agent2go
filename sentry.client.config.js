// This file configures Sentry for the browser (client-side)
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || 'production',
  
  // Performance Monitoring
  tracesSampleRate: 0.1, // 10% of transactions for performance monitoring
  
  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of error sessions
  
  // Integrations
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Error Filtering
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'chrome-extension://',
    'moz-extension://',
    
    // Network errors
    'NetworkError',
    'Network request failed',
    'Failed to fetch',
    
    // Random plugins/extensions
    'atomicFindClose',
    'fb_xd_fragment',
    
    // Other plugins
    'CanvasRenderingContext2D',
    
    // ResizeObserver
    'ResizeObserver loop limit exceeded',
  ],
  
  // Deny URLs
  denyUrls: [
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
    /^moz-extension:\/\//i,
  ],
  
  // Before sending event to Sentry
  beforeSend(event, hint) {
    // Check if it's an error event
    if (event.exception) {
      // You can add custom logic here to filter errors
      // For example, ignore errors from specific users
    }
    
    // Remove PII from user data
    if (event.user) {
      event.user = {
        id: event.user.id,
        // Remove email and other PII
      };
    }
    
    return event;
  },
  
  // Attach stack traces
  attachStacktrace: true,
  
  // Max breadcrumbs
  maxBreadcrumbs: 100,
});

// Export for use in components
export const captureException = Sentry.captureException;
export const captureMessage = Sentry.captureMessage;
export const setContext = Sentry.setContext;
export const setUser = Sentry.setUser;
