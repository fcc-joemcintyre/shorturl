/**
 * Copyright (c) Joe McIntyre, 2016
 * license: MIT (https://github.com/fcc-joemcintyre/shorturl/LICENSE.txt)
 */
"use strict";
const express = require ("express");
const routes = require ("./routes");
const listener = require ("./listener");

/**
 * Start the Timestamp server.
 */
function start (protocol, host, port) {
  console.log ("Starting Short URL server");

  // initialize and start server
  let app = express ();
  listener.init (protocol, host, port);
  routes.init (app, listener);
  app.listen (port);

  console.log ("Short URL server listening on port " + port);
}

exports.start = start;
