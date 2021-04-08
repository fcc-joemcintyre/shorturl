import express from 'express';
import * as http from 'http';
import { homepage } from './homepage.js';
import * as listener from './listener.js';
import * as routes from './routes.js';

let server;

/**
 * Start the short url server.
 * @param {string} protocol http or https
 * @param {string} host host name
 * @param {number} port HTTP port to listen to
 * @param {boolean} paas Hosted server
 * @returns {void}
 */
export function start (protocol, host, port, paas) {
  console.log ('Starting Short URL server');

  const address = `${protocol}://${host}${((paas === false) && (port !== 80)) ? `:${port}` : ''}`;

  // initialize and start server
  const app = express ();
  listener.init (address);
  routes.init (app, listener);

  const html = homepage (address);
  app.get ('*', (req, res) => res.status (200).send (html));

  server = http.createServer (app);
  server.listen (port, () => {
    console.log (`Short URL server listening on port ${port}`);
  });
}

/**
 * Stop the server
 * @returns {void}
 */
export async function stop () {
  if (server) {
    await server.close ();
  }
}
