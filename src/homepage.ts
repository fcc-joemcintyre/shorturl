import { Request } from 'express';

/**
 * Generate HTML for home page
 * @param req Express request object
 * @param localOrigin Origin when running as local server
 * @returns HTML content
 */
export function homepage (req: Request, localOrigin: string | undefined): string {
  const origin = localOrigin || `${req.protocol}//${req.hostname}`;
  return (
    `<h1>URL Shortener Service</h1>
     <p>This service returns a JSON object containing a URL that compliments
     the provided URL. When the provided URL is used, the client will be
     redirected to the original URL, providing a simple way to create an
     alias that can be shorter than the original.<p>
     <p>The API format is</p>
     <pre>  ${origin}/api/url?url=[url]</pre>
     <p>where [url] is the URL to create a short URL for.</p>
     <p>For example, using the following service call,<p>
     <a href='${origin}/api/url?url=https://www.freecodecamp.org/news/how-to-build-and-deploy-graphql-server-in-aws-lambda-using-nodejs-and-cloudformation/'>
       ${origin}/api/url?url=https://www.freecodecamp.org/news/how-to-build-and-deploy-graphql-server-in-aws-lambda-using-nodejs-and-cloudformation/
     </a>
     <p>The result is a JSON message, status 200, with the format</p>
     <pre>
     {
        'originalUrl':'https://www.freecodecamp.org/news/how-to-build-and-deploy-graphql-server-in-aws-lambda-using-nodejs-and-cloudformation/',
        'shortUrl': '${origin}/0'
     }
     </pre>
     <p>When using the new <i>shortURL</i>, the browser will be redirected to
     the <i>originalURL</i>.</p>
     <p>If the URL is not valid, the result will be a JSON error message,
     status 200, with the format</p>
     <pre>
     {
       'errorCode': 1,
       'message': 'Invalid URL'
     }
     </pre>`
  );
}
