# URL Shortener Service

[![Build Status](https://travis-ci.org/fcc-joemcintyre/shorturl.svg?branch=master)](https://travis-ci.org/fcc-joemcintyre/shorturl)

This service returns a JSON object containing a URL that compliments
the provided URL. When the provided URL is used, the client will be
redirected to the original URL, providing a simple way to create an
alias that can be shorter than the original.

The API format is

    https://[hostname]/api/url?url=[url]

where [hostname] is the host name of the server hosting the service and [url]
is the URL to create a shortened URL for.

An instance of the service is available at

> https://shorturl-jm.herukoapp.com

For example, using the following service call,

> https://shorturl-jm.herokuapp.com/api/url?url=http://www.freecodecamp.com/challenges/url-shortener-microservice

The result is a JSON message, status 200, with the format

    {
      "originalURL":"http://www.freecodecamp.com/challenges/url-shortener-microservice",
      "shortURL":"https://shorturl-jm.herokuapp.com/2"
    }

When using the new *shortURL*, the browser will be redirected to
the *originalURL*.

If the URL is not valid, the result will be a JSON error message,
status 200, with the format

    {
      "errorCode": 1,
      "message": "Invalid URL"
    }

## License
MIT
