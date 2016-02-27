/**
 * Copyright (c) Joe McIntyre, 2016
 * license: MIT (https://github.com/fcc-joemcintyre/shorturl/LICENSE.txt)
 */
"use strict";
const express = require ("express");
const routes = require ("./routes");
const listener = require ("./listener");

/**
 * Start the short url server.
 */
function start (protocol, host, port, paas) {
  console.log ("Starting Short URL server");

  // initialize and start server
  let app = express ();
  listener.init (protocol, host, port, paas);
  routes.init (app, listener);
  app.listen (port);

  console.log ("Short URL server listening on port " + port);
}

exports.start = start;
