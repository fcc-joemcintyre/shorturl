import { Request, Response } from 'express';
import * as url from 'url';

let redirectAddress = '';
const redirects: string[] = [];

/**
 * Init with hostname and port for redirect address
 * @param address Redirect address
 */
export function init (address: string) {
  redirectAddress = address;
}

/**
 * Return the short URL information for a request.
 * @param req HTTP request
 * @param res HTTP response
 */
export function shorten (req: Request, res: Response) {
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
 * @param req HTTP request
 * @param res HTTP response
 */
export function redirect (req: Request, res: Response) {
  const index = Number (req.params.index);
  if (!Number.isNaN (index) && index >= 0 && index < redirects.length) {
    res.redirect (redirects[index]);
  } else {
    // if not valid redirect, redirect to homepage
    res.redirect (`${redirectAddress}/`);
  }
}
