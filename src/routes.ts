import { Express } from 'express';
import { redirect, shorten } from './listener.js';

/**
 * Initialize routes.
 * @param app Express instance
 */
export function init (app: Express) {
  app.get ('/:index', redirect);
  app.get ('/api/url', shorten);
}
