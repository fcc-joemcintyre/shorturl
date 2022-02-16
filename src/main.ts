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

  start (command.protocol, command.host, command.port, command.paas);
}

main ();
