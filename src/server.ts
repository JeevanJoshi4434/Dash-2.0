import App from './app';

const appInstance = new App();

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error.message);
  process.exit(1); // Restart the server
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1); // Restart the server
});
appInstance.start();
