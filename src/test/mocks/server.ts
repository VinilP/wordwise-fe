import { setupServer } from "msw/node";
import { handlers, errorHandlers } from "./handlers";

// Create a server instance for Node.js testing
export const server = setupServer(...handlers);

// Create an error server for testing error scenarios
export const errorServer = setupServer(...errorHandlers);

// Helper function to switch to error mode
export const enableErrorMode = () => {
  server.use(...errorHandlers);
};

// Helper function to reset to normal mode
export const disableErrorMode = () => {
  server.resetHandlers();
  server.use(...handlers);
};
