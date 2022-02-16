import assert from 'assert';
import fetch from 'node-fetch';
import { processCommand } from '../src/cmd.js';
import * as server from '../src/server.js';

type Body = {
  originalUrl?: string,
  shortUrl?: string,
  errorCode?: number,
};

before (async () => {
  await server.start ('http', 'localhost', 3000, false);
});

after (async () => {
  await server.stop ();
});

describe ('test server', () => {
  describe ('/', () => {
    it ('should return 200 with home page', async () => {
      const res = await fetch ('http://localhost:3000/');
      assert (res.status === 200);
      const body = await res.text ();
      assert (body.startsWith ('<h1>URL Shortener Service</h1>'));
    });
  });

  describe ('invalid URL content', () => {
    it ('should return 200 with home page', async () => {
      const res = await fetch ('http://localhost:3000/dummy');
      assert (res.status === 200);
      const body = await res.text ();
      assert (body.startsWith ('<h1>URL Shortener Service</h1>'));
    });
  });

  describe ('valid request', () => {
    it ('should return JSON object with the shortened URL', async () => {
      const res = await fetch ('http://localhost:3000/api/url?url=http://www.infoworld.com');
      assert (res.status === 200);
      const body: Body = await res.json () as Body;
      assert (body.originalUrl === 'http://www.infoworld.com');
      assert (body.shortUrl === 'http://localhost:3000/0');
    });
  });

  describe ('invalid request', () => {
    it ('should return errorCode 1 in response', async () => {
      const res = await fetch ('http://localhost:3000/api/url?url=notaurl');
      assert (res.status === 200);
      const body: Body = await res.json () as Body;
      assert (body.errorCode === 1);
    });
  });
});

describe ('cmd', () => {
  describe ('empty command', () => {
    it ('should not fail', () => {
      const cmd = processCommand ([]);
      assert.deepStrictEqual (cmd, { code: 0, exit: false, protocol: 'http', host: 'localhost', port: 3000, paas: false });
    });
  });

  describe ('invalid standalone option', () => {
    it ('should fail with code 1', () => {
      const cmd = processCommand (['-j']);
      assert.deepStrictEqual (cmd, { code: 1, exit: true, protocol: 'http', host: 'localhost', port: 3000, paas: false });
    });
  });

  describe ('invalid settings option', () => {
    it ('should fail with code 1', () => {
      const cmd = processCommand (['-j=foo.js']);
      assert.deepStrictEqual (cmd, { code: 1, exit: true, protocol: 'http', host: 'localhost', port: 3000, paas: false });
    });
  });

  describe ('proper protocol argument (http)', () => {
    it ('should succeed', () => {
      const cmd = processCommand (['--protocol=http']);
      assert.deepStrictEqual (cmd, { code: 0, exit: false, protocol: 'http', host: 'localhost', port: 3000, paas: false });
    });
  });

  describe ('proper protocol argument (https)', () => {
    it ('should succeed', () => {
      const cmd = processCommand (['--protocol=https']);
      assert.deepStrictEqual (cmd, { code: 0, exit: false, protocol: 'https', host: 'localhost', port: 3000, paas: false });
    });
  });

  describe ('invalid protocol (ftp)', () => {
    it ('should fail', () => {
      const cmd = processCommand (['--protocol=ftp']);
      assert.deepStrictEqual (cmd, { code: 1, exit: true, protocol: '', host: 'localhost', port: 3000, paas: false });
    });
  });

  describe ('proper host argument', () => {
    it ('should succeed', () => {
      const cmd = processCommand (['--host=example.com']);
      assert.deepStrictEqual (cmd, { code: 0, exit: false, protocol: 'http', host: 'example.com', port: 3000, paas: false });
    });
  });

  describe ('proper port argument', () => {
    it ('should succeed', () => {
      const cmd = processCommand (['-p=2000']);
      assert.deepStrictEqual (cmd, { code: 0, exit: false, protocol: 'http', host: 'localhost', port: 2000, paas: false });
    });
  });

  describe ('port out of range (negative)', () => {
    it ('should fail', () => {
      const cmd = processCommand (['-p=-1']);
      assert.deepStrictEqual (cmd, { code: 1, exit: true, protocol: 'http', host: 'localhost', port: -1, paas: false });
    });
  });

  describe ('port out of range (positive)', () => {
    it ('should fail', () => {
      const cmd = processCommand (['-p=200000']);
      assert.deepStrictEqual (cmd, { code: 1, exit: true, protocol: 'http', host: 'localhost', port: 200000, paas: false });
    });
  });

  describe ('port not an integer', () => {
    it ('should fail', () => {
      const cmd = processCommand (['-p=2000.5']);
      assert.deepStrictEqual (cmd, { code: 1, exit: true, protocol: 'http', host: 'localhost', port: 2000.5, paas: false });
    });
  });

  describe ('port not a number', () => {
    it ('should fail', () => {
      const cmd = processCommand (['-p=ABC']);
      assert.deepStrictEqual (cmd.code, 1);
      assert.deepStrictEqual (cmd.exit, true);
      assert (Number.isNaN (cmd.port));
    });
  });

  describe ('paas option', () => {
    it ('should succeed', () => {
      const cmd = processCommand (['--paas']);
      assert.deepStrictEqual (cmd, { code: 0, exit: false, protocol: 'http', host: 'localhost', port: 3000, paas: true });
    });
  });

  describe ('unary help command', () => {
    it ('should succeed', () => {
      let cmd = processCommand (['-h']);
      assert.deepStrictEqual (cmd, { code: 0, exit: true, protocol: 'http', host: 'localhost', port: 3000, paas: false });
      cmd = processCommand (['--help']);
      assert.deepStrictEqual (cmd, { code: 0, exit: true, protocol: 'http', host: 'localhost', port: 3000, paas: false });
    });
  });

  describe ('help in command', () => {
    it ('should succeed', () => {
      let cmd = processCommand (['-p=2000', '-h']);
      assert.deepStrictEqual (cmd, { code: 0, exit: true, protocol: 'http', host: 'localhost', port: 2000, paas: false });
      cmd = processCommand (['-p=2000', '--help']);
      assert.deepStrictEqual (cmd, { code: 0, exit: true, protocol: 'http', host: 'localhost', port: 2000, paas: false });
    });
  });
});
