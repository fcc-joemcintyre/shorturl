import * as url from 'url';

let redirectAddress = '';
const redirects = [];

/**
 * Init with hostname and port for redirect address
 * @param {string} address Redirect address
 * @returns {void}
 */
export function init (address) {
  redirectAddress = address;
}

/**
 * Return the short URL information for a request.
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 * @returns {void}
 */
export function shorten (req, res) {
  let result;
  const inputUrl = req.query.url;
  const u = url.parse (inputUrl);
  const valid = (u.hostname && u.slashes && u.host);
  if (valid) {
    const index = redirects.length;
    const shortUrl = `${redirectAddress}/${index}`;
    redirects.push (inputUrl);
    result = {
      originalUrl: inputUrl,
      shortUrl,
    };
  } else {
    result = {
      errorCode: 1,
      message: 'Invalid URL',
    };
  }
  res.status (200).json (result);
}

/**
 * Redirect to original URL from short URL
 * @param {Object} req HTTP request
 * @param {Object} res HTTP response
 * @returns {void}
 */
export function redirect (req, res) {
  const { index } = req.params;
  if ((index >= 0) && (index < redirects.length)) {
    res.redirect (redirects[index]);
  } else {
    // if not valid redirect, redirect to homepage
    res.redirect (`${redirectAddress}/`);
  }
}
