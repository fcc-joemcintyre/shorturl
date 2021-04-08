/**
 @typedef {import ('express').Express} Express
 */

/**
 * Initialize routes.
 * @param {Express} app Express instance
 * @param {object} listener API implementation
 * @returns {void}
 */
export function init (app, listener) {
  app.get ('/:index', listener.redirect);
  app.get ('/api/url', listener.shorten);
}
