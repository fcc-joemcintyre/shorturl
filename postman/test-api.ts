import newman from 'newman'; // eslint-disable-line import/no-extraneous-dependencies
import { start, stop } from '../src/server.js';

main ();

/**
 * Initialize test server instance
 * if --server arg provided, start server for interactive use
 * if no arg provided, run postman tests and exit
 */
async function main (): Promise<void> {
  const args = process.argv.slice (2);
  const server = args.reduce ((acc: boolean, a) => (
    acc || a.toLowerCase () === '--server'
  ), false);

  const port = 3000;

  // start application server
  await start ('http://localhost:3000', port);

  // if running tests, start test runner
  if (!server) {
    newman.run ({
      collection: './shorturl.postman_collection.json',
      reporters: 'cli',
    }, async () => {
      await stop ();
      process.exit (0);
    });
  }
}
