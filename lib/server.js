const express = require ('express');
const http = require ('http');
const { homepage } = require ('./homepage');
const listener = require ('./listener');
const routes = require ('./routes');

let server;

/**
 * Start the short url server.
 * @param {string} protocol http or https
 * @param {string} host host name
 * @param {number} port HTTP port to listen to
 * @param {bool} paas Hosted server
 * @returns {void}
 */
function start (protocol, host, port, paas) {
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
async function stop () {
  if (server) {
    await server.close ();
  }
}

exports.start = start;
exports.stop = stop;
