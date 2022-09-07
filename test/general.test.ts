import assert from 'assert';
import { processCommand } from '../src/cmd.js';

describe ('cmd', () => {
  describe ('empty command', () => {
    it ('should not fail', () => {
      const cmd = processCommand ([]);
      assert.deepStrictEqual (cmd, { code: 0, exit: false, port: 3000 });
    });
  });

  describe ('invalid standalone option', () => {
    it ('should fail with code 1', () => {
      const cmd = processCommand (['-j']);
      assert.deepStrictEqual (cmd, { code: 1, exit: true, port: 3000 });
    });
  });

  describe ('invalid settings option', () => {
    it ('should fail with code 1', () => {
      const cmd = processCommand (['-j=foo.js']);
      assert.deepStrictEqual (cmd, { code: 1, exit: true, port: 3000 });
    });
  });

  describe ('port out of range (negative)', () => {
    it ('should fail', () => {
      const cmd = processCommand (['-p=-1']);
      assert.deepStrictEqual (cmd, { code: 1, exit: true, port: -1 });
    });
  });

  describe ('port out of range (positive)', () => {
    it ('should fail', () => {
      const cmd = processCommand (['-p=200000']);
      assert.deepStrictEqual (cmd, { code: 1, exit: true, port: 200000 });
    });
  });

  describe ('port not an integer', () => {
    it ('should fail', () => {
      const cmd = processCommand (['-p=2000.5']);
      assert.deepStrictEqual (cmd, { code: 1, exit: true, port: 2000.5 });
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

  describe ('unary help command', () => {
    it ('should succeed', () => {
      let cmd = processCommand (['-h']);
      assert.deepStrictEqual (cmd, { code: 0, exit: true, port: 3000 });
      cmd = processCommand (['--help']);
      assert.deepStrictEqual (cmd, { code: 0, exit: true, port: 3000 });
    });
  });

  describe ('help in command', () => {
    it ('should succeed', () => {
      let cmd = processCommand (['-p=2000', '-h']);
      assert.deepStrictEqual (cmd, { code: 0, exit: true, port: 2000 });
      cmd = processCommand (['-p=2000', '--help']);
      assert.deepStrictEqual (cmd, { code: 0, exit: true, port: 2000 });
    });
  });
});
