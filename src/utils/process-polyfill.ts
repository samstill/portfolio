if (typeof window !== 'undefined' && !window.process) {
  window.process = {
    env: {
      NODE_ENV: process.env.NODE_ENV,
      BASE_PATH: process.env.BASE_PATH || '',
    },
  };
}

export {};
