export type CommandResult = {
  code: number,
  exit: boolean,
  port: number,
}

/**
 * Valid command options
 *  [-p | --port] port to listen on, default 3000
 * @param args Array of arguments
 * @returns Command parsing result
 */
export function processCommand (args: string[]): CommandResult {
  let showHelp = false;
  const errors = [];
  const result: CommandResult = {
    code: 0,
    exit: false,
    port: 0,
  };

  for (const arg of args) {
    // if a settings argument, it will contain an equals sign
    if (arg.indexOf ('=') > -1) {
      // divide argument into left and right sides, and assign
      const elements = arg.split ('=');
      const key = elements[0];
      if ((key === '-p') || (key === '--port')) {
        result.port = Number (elements[1]);
      } else {
        errors.push (`Error: Invalid option (${elements[0]})`);
      }
    } else {
      if (arg === '-h' || arg === '--help') {
        showHelp = true;
      } else {
        errors.push (`Error: Invalid option (${arg})`);
      }
    }
  }

  // validate arguments, assign defaults
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
      `Usage: node lib/main.js [-p=port] [-h]
  -p or --port      Port number to listen on. Default: 3000
  -h or --help      This message.`
    );
    result.code = (showHelp) ? 0 : 1;
    result.exit = true;
  }
  return result;
}
