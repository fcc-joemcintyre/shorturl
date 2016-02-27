/**
 * Copyright (c) Joe McIntyre, 2016
 * license: MIT (https://github.com/fcc-joemcintyre/shorturl/LICENSE.txt)
 */
"use strict";
const processCommand = require ("./cmd").processCommand;
const server = require ("./server");

if (require.main === module) {
  main ();
}

/**
 * Process command line to start local version of service.
 */
function main () {
  const command = processCommand (process.argv.slice (2));
  if (command.exit) {
    process.exit (command.code);
  }

  let protocol = command.protocol;
  let host = command.host;
  let port = command.port;
  server.start (protocol, host, port);
}
