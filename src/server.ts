import express from 'express';
import * as http from 'http';
import { Server } from 'http';
import { homepage } from './homepage.js';
import * as listener from './listener.js';
import * as routes from './routes.js';

let server: Server;

/**
 * Start the short url server.
 * @param localOrigin Origin when running as local server, undefined if not local
 * @param port Port number
 */
export async function start (localOrigin: string | undefined, port: number) {
  console.log ('Starting Short URL server');

  // initialize and start server
  const app = express ();
  listener.init (localOrigin);
  routes.init (app);

  app.get ('*', (req, res) => res.status (200).send (homepage (req, localOrigin)));

  server = http.createServer (app);
  await listenAsync (server, port);
  console.log (`Short URL server listening on port ${port}`);
}

/**
 * Stop the server
 */
export async function stop () {
  if (server) {
    await server.close ();
  }
}

/**
 * Async / await support for http.Server.listen
 * @param s http.Server instance
 * @param port port number
 * @returns Promise to await server.listen on
 */
function listenAsync (s: http.Server, port: number) {
  return new Promise ((resolve) => {
    s.listen (port, () => { resolve (true); });
  });
}
