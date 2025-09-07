import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Create a worker instance for browser testing
export const worker = setupWorker(...handlers);

