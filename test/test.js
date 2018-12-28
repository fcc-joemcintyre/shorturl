const assert = require ('assert');
const fetch = require ('node-fetch');
const processCommand = require ('../lib/cmd').processCommand;
const server = require ('../lib/server');

before (async function () {
  await server.start ('http', 'localhost', 3000, false);
});

after (async function () {
  await server.stop ();
});

describe ('test server', function () {
  describe ('/', function () {
    it ('should return 200 with home page', async function () {
      const res = await fetch ('http://localhost:3000/');
      assert (res.status === 200);
      const body = await res.text ();
      assert (body.startsWith ('<h1>URL Shortener Service</h1>'));
    });
  });

  describe ('invalid URL content', function () {
    it ('should return 200 with home page', async function () {
      const res = await fetch ('http://localhost:3000/dummy');
      assert (res.status === 200);
      const body = await res.text ();
      assert (body.startsWith ('<h1>URL Shortener Service</h1>'));
    });
  });

  describe ('valid request', function () {
    it ('should return JSON object with the shortened URL', async function () {
      const res = await fetch ('http://localhost:3000/api/url?url=http://www.infoworld.com');
      assert (res.status === 200);
      const body = await res.json ();
      assert (body.originalUrl === 'http://www.infoworld.com');
      assert (body.shortUrl === 'http://localhost:3000/0');
    });
  });

  describe ('invalid request', function () {
    it ('should return errorCode 1 in response', async function () {
      const res = await fetch ('http://localhost:3000/api/url?url=notaurl');
      assert (res.status === 200);
      const body = await res.json ();
      assert (body.errorCode === 1);
    });
  });
});

describe ('cmd', function () {
  describe ('empty command', function () {
    it ('should not fail', function () {
      const cmd = processCommand ([]);
      assert.deepStrictEqual (cmd, { code: 0, exit: false, protocol: 'http', host: 'localhost', port: 3000, paas: false });
    });
  });

  describe ('invalid standalone option', function () {
    it ('should fail with code 1', function () {
      const cmd = processCommand (['-j']);
      assert.deepStrictEqual (cmd, { code: 1, exit: true, protocol: 'http', host: 'localhost', port: 3000, paas: false });
    });
  });

  describe ('invalid settings option', function () {
    it ('should fail with code 1', function () {
      const cmd = processCommand (['-j=foo.js']);
      assert.deepStrictEqual (cmd, { code: 1, exit: true, protocol: 'http', host: 'localhost', port: 3000, paas: false });
    });
  });

  describe ('proper protocol argument (http)', function () {
    it ('should succeed', function () {
      const cmd = processCommand (['--protocol=http']);
      assert.deepStrictEqual (cmd, { code: 0, exit: false, protocol: 'http', host: 'localhost', port: 3000, paas: false });
    });
  });

  describe ('proper protocol argument (https)', function () {
    it ('should succeed', function () {
      const cmd = processCommand (['--protocol=https']);
      assert.deepStrictEqual (cmd, { code: 0, exit: false, protocol: 'https', host: 'localhost', port: 3000, paas: false });
    });
  });

  describe ('invalid protocol (ftp)', function () {
    it ('should fail', function () {
      const cmd = processCommand (['--protocol=ftp']);
      assert.deepStrictEqual (cmd, { code: 1, exit: true, protocol: 'ftp', host: 'localhost', port: 3000, paas: false });
    });
  });

  describe ('proper host argument', function () {
    it ('should succeed', function () {
      const cmd = processCommand (['--host=example.com']);
      assert.deepStrictEqual (cmd, { code: 0, exit: false, protocol: 'http', host: 'example.com', port: 3000, paas: false });
    });
  });

  describe ('proper port argument', function () {
    it ('should succeed', function () {
      const cmd = processCommand (['-p=2000']);
      assert.deepStrictEqual (cmd, { code: 0, exit: false, protocol: 'http', host: 'localhost', port: 2000, paas: false });
    });
  });

  describe ('port out of range (negative)', function () {
    it ('should fail', function () {
      const cmd = processCommand (['-p=-1']);
      assert.deepStrictEqual (cmd, { code: 1, exit: true, protocol: 'http', host: 'localhost', port: -1, paas: false });
    });
  });

  describe ('port out of range (positive)', function () {
    it ('should fail', function () {
      const cmd = processCommand (['-p=200000']);
      assert.deepStrictEqual (cmd, { code: 1, exit: true, protocol: 'http', host: 'localhost', port: 200000, paas: false });
    });
  });

  describe ('port not an integer', function () {
    it ('should fail', function () {
      const cmd = processCommand (['-p=2000.5']);
      assert.deepStrictEqual (cmd, { code: 1, exit: true, protocol: 'http', host: 'localhost', port: 2000.5, paas: false });
    });
  });

  describe ('port not a number', function () {
    it ('should fail', function () {
      const cmd = processCommand (['-p=ABC']);
      assert.deepStrictEqual (cmd.code, 1);
      assert.deepStrictEqual (cmd.exit, true);
      assert (Number.isNaN (cmd.port));
    });
  });

  describe ('paas option', function () {
    it ('should succeed', function () {
      const cmd = processCommand (['--paas']);
      assert.deepStrictEqual (cmd, { code: 0, exit: false, protocol: 'http', host: 'localhost', port: 3000, paas: true });
    });
  });

  describe ('unary help command', function () {
    it ('should succeed', function () {
      let cmd = processCommand (['-h']);
      assert.deepStrictEqual (cmd, { code: 0, exit: true, protocol: 'http', host: 'localhost', port: 3000, paas: false });
      cmd = processCommand (['--help']);
      assert.deepStrictEqual (cmd, { code: 0, exit: true, protocol: 'http', host: 'localhost', port: 3000, paas: false });
    });
  });

  describe ('help in command', function () {
    it ('should succeed', function () {
      let cmd = processCommand (['-p=2000', '-h']);
      assert.deepStrictEqual (cmd, { code: 0, exit: true, protocol: 'http', host: 'localhost', port: 2000, paas: false });
      cmd = processCommand (['-p=2000', '--help']);
      assert.deepStrictEqual (cmd, { code: 0, exit: true, protocol: 'http', host: 'localhost', port: 2000, paas: false });
    });
  });
});
