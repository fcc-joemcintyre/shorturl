/**
  @typedef {object} CommandResult
  @property {number} code Error code (0 if no error)
  @property {boolean} exit Flag, exit or not
  @property {number} port Port number
  @property {string} protocol Protocol (http or https)
  @property {string} host Host name
  @property {boolean} paas Hosting location (hosted true, local false)
 */

/**
 * Valid command options
 *  [--protocol] protocol (http or https), default http
 *  [--host] host name, default localhost
 *  [-p | --port] port to listen on, default 3000
 *  [--paas] if PaaS, don't use port externally, default false
 * @param {string[]} args Array of arguments
 * @returns {CommandResult} Command parsing result
 */
export function processCommand (args) {
  let showHelp = false;
  const errors = [];
  const result = {
    code: 0,
    exit: false,
    protocol: '',
    host: '',
    port: 0,
    paas: false,
  };

  for (const arg of args) {
    // if a settings argument, it will contain an equals sign
    if (arg.indexOf ('=') > -1) {
      // divide argument into left and right sides, and assign
      const elements = arg.split ('=');
      const key = elements[0];
      if (key === '--host') {
        result.host = elements[1];
      } else if (key === '--protocol') {
        result.protocol = elements[1];
      } else if ((key === '-p') || (key === '--port')) {
        result.port = Number (elements[1]);
      } else {
        errors.push (`Error: Invalid option (${elements[0]})`);
      }
    } else {
      if (arg === '-h' || arg === '--help') {
        showHelp = true;
      } else if (arg === '--paas') {
        result.paas = true;
      } else {
        errors.push (`Error: Invalid option (${arg})`);
      }
    }
  }

  // validate arguments, assign defaults
  if (result.protocol === '') {
    result.protocol = 'http';
  } else if ((result.protocol !== 'http') && (result.protocol !== 'https')) {
    errors.push (`Invalid protocol (${result.protocol}). Must be http or https`);
    result.protocol = '';
  }
  if (result.host === '') {
    result.host = 'localhost';
  }
  if (Number.isNaN (result.port) || (result.port < 0) ||
    (result.port > 65535) || (Math.floor (result.port) !== result.port)) {
    errors.push (`Invalid port number (${result.port}). Must be integer between 0 and 65535`);
  } else if (result.port === 0) {
    result.port = 3000;
  }

  // if help not an argument, output list of errors
  if ((showHelp === false) && (errors.length > 0)) {
    for (const error of errors) {
      console.log (error);
    }
  }

  // if help argument or errors, output usage message
  if ((showHelp === true) || (errors.length > 0)) {
    console.log (
      `Usage: node lib/main.js [--protocol=http|https][--host=hostname][-p=port][-e=port] [-h]
  --protocol        Protocol to use (http or https). Default: http
  --host            Host name to use. Default: localhost
  -p or --port      Port number to listen on. Default: 3000
  --paas            PaaS (do not externalize port)
  -h or --help      This message.`
    );
    result.code = (showHelp) ? 0 : 1;
    result.exit = true;
  }
  return result;
}
