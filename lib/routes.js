/**
 * Initialize routes.
 * @param {Object} app Express instance
 * @param {Object} listener API implementation
 * @returns {void}
 */
export function init (app, listener) {
  app.get ('/:index', listener.redirect);
  app.get ('/api/url', listener.shorten);
}
