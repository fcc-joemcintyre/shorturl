/**
 * Copyright (c) Joe McIntyre, 2016
 * license: MIT (https://github.com/fcc-joemcintyre/shorturl/LICENSE.txt)
 */
"use strict";
const url = require ("url");

let redirectAddress = "";
let redirects = [];

/**
 * Init with hostname and port for redirect address
 */
function init (protocol, host, port) {
  redirectAddress = `${protocol}://${host}`;
  if (port !== 80) {
    redirectAddress += `:${port}`;
  }
}

/**
 * Return homepage with service usage instructions.
 */
function homepage (req, res) {
  let html =
    `<h1>URL Shortener Service</h1>
     <p>This service returns a JSON object containing a URL that compliments
     the provided URL. When the provided URL is used, the client will be
     redirected to the original URL, providing a simple way to create an
     alias that can be shorter than the original.<p>
     <p>The API format is</p>
     <pre>  ${redirectAddress}/api/url?url=[url]</pre>
     <p>where [url] is the URL to create a short URL for.</p>
     <p>For example, using the following service call,<p>
     <a href='${redirectAddress}/api/url?url=http://www.freecodecamp.com/challenges/url-shortener-microservice'>
       ${redirectAddress}/api/url?url=http://www.freecodecamp.com/challenges/url-shortener-microservice
     </a>
     <p>The result is a JSON message with the format</p>
     <pre>
     {
        "originalUrl":"http://www.freecodecamp.com/challenges/url-shortener-microservice",
        "shortUrl": "${redirectAddress}/0"
     }
     </pre>
     <p>When using the new <i>shortURL</i>, the browser will be redirected to
     the <i>originalURL</i>.</p>
     <p>If any elements are not valid, null will be returned for those values.</p>`;
  res.status (200).send (html);
}

/**
 * Return the short URL information for a request.
 */
function shorten (req, res) {
  let result;
  let inputUrl = req.query.url;
  let u = url.parse (inputUrl);
  let valid = (u.hostname && u.slashes && u.host);
  if (valid) {
    let index = redirects.length;
    let redirect = `${redirectAddress}/${index}`;
    redirects.push (inputUrl);
    result = {
      originalUrl: inputUrl,
      shortUrl: redirect
    };
  } else {
    result = {
      errorCode: 1,
      message: "Invalid URL"
    };
  }
  res.status (200).json (result);
}

/**
 * Redirect to original URL from short URL
 */
function redirect (req, res) {
  let index = req.params.index;
  if ((index >= 0) && (index < redirects.length)) {
    res.redirect (redirects[index]);
  } else {
    // if not valid redirect, redirect to homepage
    res.redirect (`${redirectAddress}/`);
  }
}

exports.init = init;
exports.homepage = homepage;
exports.shorten = shorten;
exports.redirect = redirect;
