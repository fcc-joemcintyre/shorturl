/**
 * Copyright (c) Joe McIntyre, 2016
 * license: MIT (https://github.com/fcc-joemcintyre/shorturl/LICENSE.txt)
 */
"use strict";

/**
 * Valid command options
 *  [--protocol] protocol (http or https)
 *  [--host] host name
 *  [-p | --port] port to listen on
 * @param {[String]} Array of arguments
 * @returns {Object} code:{Integer}, exit:{Boolean}, protocol:{String},
                     host:{String}, port:{Integer}
 */
function processCommand (args) {
  let showHelp = false;
  let errors = [];
  let result = {
    code: 0,
    exit: false,
    protocol: "",
    host: "",
    port: 0
  };

  for (let arg of args) {
    // if a settings argument, it will contain an equals sign
    if (arg.indexOf ("=") > -1) {
      // divide argument into left and right sides, and assign
      let elements = arg.split ("=");
      let key = elements[0];
      if (key === "--host") {
        result.host = elements[1];
      } else if (key === "--protocol") {
        result.protocol = elements[1];
      } else if ((key === "-p") || (key === "--port")) {
        result.port = Number (elements[1]);
      } else{
        errors.push (`Error: Invalid option (${elements[0]})`);
      }
    } else {
      if (arg === "-h" || arg === "--help") {
        showHelp = true;
      } else {
        errors.push (`Error: Invalid option (${arg})`);
      }
    }
  }

  // validate arguments, assign defaults
  if (result.protocol === "") {
    result.protocol = "http";
  } else if ((result.protocol !== "http") && (result.protocol !== "https")) {
    errors.push (`Invalid protocol (${result.protocol}). Must be http or https`);
  }
  if (result.host === "") {
    result.host = "localhost";
  }
  if (isNaN (result.port) || (result.port < 0) || (result.port > 65535) || (Math.floor (result.port) !== result.port)) {
    errors.push ("Invalid port number (${result.port}). Must be integer between 0 and 65535");
  } else if (result.port === 0) {
    result.port = 3000;
  }

  // if help not an argument, output list of errors
  if ((showHelp === false) && (errors.length > 0)) {
    for (let error of errors) {
      console.log (error);
    }
  }

  // if help argument or errors, output usage message
  if ((showHelp === true) || (errors.length > 0)) {
    console.log (
`Usage: shorturl [--protocol=http|https][--host=hostname][-p=port] [-h]
  --protocol    Protocol to use (http or https). Default: http
  --host        Host name to use. Default: localhost
  -p or --port  Port number to listen on. Default: 3000
  -h or --help  This message.`);
    result.code = (showHelp) ? 0 : 1;
    result.exit = true;
  }
  return result;
}

exports.processCommand = processCommand;
