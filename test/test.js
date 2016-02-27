/**
 * Copyright (c) Joe McIntyre, 2016
 * license: MIT (https://github.com/fcc-joemcintyre/shorturl/LICENSE.txt)
 */
"use strict";
const assert = require ("assert");
const request = require ("request");
const processCommand = require ("../lib/cmd").processCommand;
const server = require ("../lib/server");

before (function () {
  server.start ("http", "localhost", 3000);
});

describe ("test server", function () {
  describe ("/", function () {
    it ("should return 200 with instructions", function (done) {
      request.get ("http://localhost:3000/", function (err, res, body) {
        if (err) { return done (err); }
        if (res.statusCode === 200) {
          if (body.startsWith ("<h1>URL Shortener Service</h1>")) {
            return done ();
          }
        }
        return done (new Error ("Invalid response"));
      });
    });
  });

  describe ("invalid URL content", function () {
    it ("should return 200 with instructions", function (done) {
      request.get ("http://localhost:3000/dummy", function (err, res, body) {
        if (err) { return done (err); }
        if (res.statusCode === 200) {
          if (body.startsWith ("<h1>URL Shortener Service</h1>")) {
            return done ();
          }
        }
        return done (new Error ("Invalid response"));
      });
    });
  });

  describe ("valid request", function () {
    it ("should return JSON object with the shortened URL", function (done) {
      request.get ("http://localhost:3000/api/url?url=http://www.infoworld.com", function (err, res, body) {
        if (err) { return done (err); }
        if (res.statusCode === 200) {
          body = JSON.parse (body);
          if ((body.originalUrl === "http://www.infoworld.com") &&
               (body.shortUrl === "http://localhost:3000/0")) {
            return done ();
          } else {
            return done (new Error ("Invalid response values"));
          }
        }
        return done (new Error (`Invalid status code ${res.statusCode}`));
      });
    });
  });

  describe ("invalid request", function () {
    it ("should return errorCode 1 in response", function (done) {
      request.get ("http://localhost:3000/api/url?url=notaurl", function (err, res, body) {
        if (err) { return done (err); }
        if (res.statusCode === 200) {
          body = JSON.parse (body);
          if (body.errorCode === 1) {
            return done ();
          } else {
            return done (new Error ("Invalid response values"));
          }
        }
        return done (new Error (`Invalid status code ${res.statusCode}`));
      });
    });
  });
});

describe ("cmd", function () {
  describe ("empty command", function () {
    it ("should not fail", function () {
      let cmd = processCommand ([]);
      assert.deepStrictEqual (cmd, {code:0, exit:false, protocol:"http", host:"localhost", port:3000});
    });
  });

  describe ("invalid standalone option", function () {
    it ("should fail with code 1", function () {
      let cmd = processCommand (["-j"]);
      assert.deepStrictEqual (cmd, {code:1, exit:true, protocol:"http", host:"localhost", port:3000});
    });
  });

  describe ("invalid settings option", function () {
    it ("should fail with code 1", function () {
      let cmd = processCommand (["-j=foo.js"]);
      assert.deepStrictEqual (cmd, {code:1, exit:true, protocol:"http", host:"localhost", port:3000});
    });
  });

  describe ("proper protocol argument (http)", function () {
    it ("should succeed", function () {
      let cmd = processCommand (["--protocol=http"]);
      assert.deepStrictEqual (cmd, {code:0, exit:false, protocol:"http", host:"localhost", port:3000});
    });
  });

  describe ("proper protocol argument (https)", function () {
    it ("should succeed", function () {
      let cmd = processCommand (["--protocol=https"]);
      assert.deepStrictEqual (cmd, {code:0, exit:false, protocol:"https", host:"localhost", port:3000});
    });
  });

  describe ("invalid protocol (ftp)", function () {
    it ("should fail", function () {
      let cmd = processCommand (["--protocol=ftp"]);
      assert.deepStrictEqual (cmd, {code:1, exit:true, protocol:"ftp", host:"localhost", port:3000});
    });
  });

  describe ("proper host argument", function () {
    it ("should succeed", function () {
      let cmd = processCommand (["--host=example.com"]);
      assert.deepStrictEqual (cmd, {code:0, exit:false, protocol:"http", host:"example.com", port:3000});
    });
  });

  describe ("proper port argument", function () {
    it ("should succeed", function () {
      let cmd = processCommand (["-p=2000"]);
      assert.deepStrictEqual (cmd, {code:0, exit:false, protocol:"http", host:"localhost", port:2000});
    });
  });

  describe ("port out of range (negative)", function () {
    it ("should fail", function () {
      let cmd = processCommand (["-p=-1"]);
      assert.deepStrictEqual (cmd, {code:1, exit:true, protocol:"http", host:"localhost", port:-1});
    });
  });

  describe ("port out of range (positive)", function () {
    it ("should fail", function () {
      let cmd = processCommand (["-p=200000"]);
      assert.deepStrictEqual (cmd, {code:1, exit:true, protocol:"http", host:"localhost", port:200000});
    });
  });

  describe ("port not an integer", function () {
    it ("should fail", function () {
      let cmd = processCommand (["-p=2000.5"]);
      assert.deepStrictEqual (cmd, {code:1, exit:true, protocol:"http", host:"localhost", port:2000.5});
    });
  });

  describe ("port not a number", function () {
    it ("should fail", function () {
      let cmd = processCommand (["-p=ABC"]);
      assert.deepStrictEqual (cmd.code, 1);
      assert.deepStrictEqual (cmd.exit, true);
      assert (isNaN (cmd.port));
    });
  });

  describe ("unary help command", function () {
    it ("should succeed", function () {
      let cmd = processCommand (["-h"]);
      assert.deepStrictEqual (cmd, {code:0, exit:true, protocol:"http", host:"localhost", port:3000});
      cmd = processCommand (["--help"]);
      assert.deepStrictEqual (cmd, {code:0, exit:true, protocol:"http", host:"localhost", port:3000});
    });
  });

  describe ("help in command", function () {
    it ("should succeed", function () {
      let cmd = processCommand (["-p=2000", "-h"]);
      assert.deepStrictEqual (cmd, {code:0, exit:true, protocol:"http", host:"localhost", port:2000});
      cmd = processCommand (["-p=2000", "--help"]);
      assert.deepStrictEqual (cmd, {code:0, exit:true, protocol:"http", host:"localhost", port:2000});
    });
  });
});
