const isProd = process.env.NODE_ENV === 'production';

export const logger = {
  info: (...args: any[]) => {
    if (!isProd) {
      console.info(...args);
    }
  },
  
  error: (...args: any[]) => {
    if (!isProd) {
      console.error(...args);
    }
    // In production, you might want to send errors to an error tracking service
    // Example: Sentry.captureException(args);
  },
  
  warn: (...args: any[]) => {
    if (!isProd) {
      console.warn(...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (!isProd) {
      console.debug(...args);
    }
  }
};

export default logger; 