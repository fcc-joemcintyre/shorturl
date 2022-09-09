# URL Shortener Service

This service returns a JSON object containing a URL that compliments
the provided URL. When the provided URL is used, the client will be
redirected to the original URL, providing a simple way to create an
alias that can be shorter than the original.

The API format is

    https://[hostname]/api/url?url=[url]

where [hostname] is the host name of the server hosting the service and [url]
is the URL to create a shortened URL for.

An instance of the service is available at

> https://shorturl-jm.onrender.com

For example, using the following URL in a browser,

> https://shorturl-jm.onrender.com/api/url?url=https://www.freecodecamp.org/news/how-to-build-and-deploy-graphql-server-in-aws-lambda-using-nodejs-and-cloudformation/

The result is a JSON message, status 200, with the format

    {
      "originalURL":"https://www.freecodecamp.org/news/how-to-build-and-deploy-graphql-server-in-aws-lambda-using-nodejs-and-cloudformation/",
      "shortURL":"https://shorturl-jm.onrender.com/2"
    }

When using the new *shortURL* (in this case with the trailing number 2, which will vary)

> https://shorturl-jm.onrender.com/2

the browser will be redirected to the *originalURL*.

If the URL is not valid, the result will be a JSON error message,
status 200, with the format

    {
      "errorCode": 1,
      "message": "Invalid URL"
    }

## Package Scripts

The following scripts are defined in this package

Run ESLint against lib and test directories

```
npm run lint
```

Typecheck

```
npm run typecheck
```

Run unit and integration tests

```
npm test
```

Development Build

```
npm run dev
```

Production Build

```
npm run build
```

Start local server instance

```
npm start
```

## License
MIT
