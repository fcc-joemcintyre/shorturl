import express from 'express';
import * as http from 'http';
import { Server } from 'http';
import { homepage } from './homepage.js';
import * as listener from './listener.js';
import * as routes from './routes.js';

let server: Server;

/**
 * Start the short url server.
 * @param protocol http or https
 * @param host host name
 * @param port HTTP port to listen to
 * @param paas Hosted server
 */
export async function start (protocol: string, host: string, port: number, paas: boolean) {
  console.log ('Starting Short URL server');

  const address = `${protocol}://${host}${((paas === false) && (port !== 80)) ? `:${port}` : ''}`;

  // initialize and start server
  const app = express ();
  listener.init (address);
  routes.init (app);

  const html = homepage (address);
  app.get ('*', (req, res) => res.status (200).send (html));

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
