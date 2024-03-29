import { Request, Response } from 'express';
import * as url from 'url';

let redirectOrigin: string | undefined;
const redirects: string[] = [];

/**
 * Init with hostname and port for redirect address
 * @param localOrigin Origin when running as local server
 */
export function init (localOrigin: string | undefined) {
  redirectOrigin = localOrigin;
}

/**
 * Return the short URL information for a request.
 * @param req HTTP request
 * @param res HTTP response
 */
export function shorten (req: Request, res: Response) {
  const t = redirectOrigin || `${req.protocol}//${req.hostname}`;
  const inputUrl = req.query.url;
  if (typeof (inputUrl) === 'string') {
    const u = url.parse (inputUrl);
    const valid = (u.hostname && u.slashes && u.host);
    if (valid) {
      const index = redirects.length;
      const shortUrl = `${t}/${index}`;
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
    const t = redirectOrigin || `${req.protocol}//${req.hostname}`;
    res.redirect (`${t}/`);
  }
}
