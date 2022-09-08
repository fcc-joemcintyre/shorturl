import { processCommand } from './cmd.js';
import { start } from './server.js';

/**
 * Process command line to start server.
 */
function main () {
  const command = processCommand (process.argv.slice (2));
  if (command.exit) {
    process.exit (command.code);
  }

  if (process.env.NODE_ENV === 'development') {
    start (`http://localhost:${command.port}`, command.port);
  } else {
    const port = Number (process.env.PORT) || command.port;
    start (undefined, port);
  }
}

main ();
