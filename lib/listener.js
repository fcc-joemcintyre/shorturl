import * as url from 'url';

/**
  @typedef {import ('express').Request} Request
  @typedef {import ('express').Response} Response
 */

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
 * @param {Request} req HTTP request
 * @param {Response} res HTTP response
 * @returns {void}
 */
export function shorten (req, res) {
  const inputUrl = req.query.url;
  if (typeof (inputUrl) === 'string') {
    const u = url.parse (inputUrl);
    const valid = (u.hostname && u.slashes && u.host);
    if (valid) {
      const index = redirects.length;
      const shortUrl = `${redirectAddress}/${index}`;
      redirects.push (inputUrl);
      res.status (200).json ({
        originalUrl: inputUrl,
        shortUrl,
      });
      return;
    }
  }
  res.status (200).json ({ errorCode: 1, message: 'Invalid URL' });
}

/**
 * Redirect to original URL from short URL
 * @param {Request} req HTTP request
 * @param {Response} res HTTP response
 * @returns {void}
 */
export function redirect (req, res) {
  const index = Number (req.params.index);
  if (!Number.isNaN (index) && index >= 0 && index < redirects.length) {
    res.redirect (redirects[index]);
  } else {
    // if not valid redirect, redirect to homepage
    res.redirect (`${redirectAddress}/`);
  }
}
