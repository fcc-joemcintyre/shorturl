/**
 * Copyright (c) Joe McIntyre, 2016
 * license: MIT (https://github.com/fcc-joemcintyre/shorturl/LICENSE.txt)
 */

"use strict";

/**
 * Initialize routes.
 */
function init (app, listener) {
  app.get ("/", listener.homepage);
  app.get ("/:index", listener.redirect);
  app.get ("/api/url", listener.shorten);
  app.use (listener.homepage);
}

exports.init = init;
