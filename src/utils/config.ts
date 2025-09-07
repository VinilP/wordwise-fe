interface Config {
  apiBaseUrl: string;
  appName: string;
  nodeEnv: string;
}

const config: Config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  appName: import.meta.env.VITE_APP_NAME || 'Book Review Platform',
  nodeEnv: import.meta.env.VITE_NODE_ENV || 'development',
};

// Named exports for backward compatibility
export const API_BASE_URL = config.apiBaseUrl;
export const APP_NAME = config.appName;
export const NODE_ENV = config.nodeEnv;

export default config;
