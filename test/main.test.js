const spawn = require('child_process').spawn;
const path = require('path');
const fs = require('fs');

const expect = require('chai').expect;

const inputFile = path.resolve('./files', 'input.txt');
const largeInputFile = path.resolve('./files', 'largeinput.txt');

const testCases = new Map();

// add test cases
testCases.set('node-rx', ['node', 'javascript/lib/cli.js', '--rx']);
testCases.set('node-stream', ['node', 'javascript/lib/cli.js', '--stream']);
testCases.set('ruby', ['ruby', 'ruby/main.rb']);

describe('[Main]', () => {

  function test({
    command,
    args,
    expected,
    done
  }) {
    const child = spawn(command, args);
    const chunks = [];

    child.stdout
      .on('data', (chunk) => {
        chunks.push(chunk.toString());
      });

    child.on('exit', (code) => {

      if (code !== 0) {
        done(new Error(`child process exited with code ${code}`));

        return;
      }

      const results = chunks
        .join('')
        .split('\n')
        .map(parseFloat)
        .filter((item) => {
          return !isNaN(item);
        });

      expect(results.toString()).to.equal(expected.toString());

      done();
    });

    return child;
  }

  describe('input.txt', () => {
    const expected = [
      1,
      4,
      1,
      0,
      1,
      0
    ];

    testCases.forEach((command, testName) => {
      const testPath = path.resolve('.', command[1]);

      describe(`#${testName}`, () => {

        it('succeeds with a filepath argument', (done) => {
          test({
            command: command[0],
            args: [testPath, inputFile].concat(command.slice(2)),
            expected,
            done
          });
        });

        it('succeeds when a file is piped in', (done) => {
          const file = fs.createReadStream(inputFile);

          const child = test({
            command: command[0],
            args: [testPath].concat(command.slice(2)),
            expected,
            done
          });

          file.pipe(child.stdin);
        });
      });
    });
  });

  describe('largeinput.txt', () => {
    const expected = [
      4,
      19,
      0,
      24,
      29,
      13
    ];

    testCases.forEach((command, testName) => {
      const testPath = path.resolve('.', command[1]);

      describe(`#${testName}`, () => {

        it('succeeds with a filepath argument', (done) => {
          test({
            command: command[0],
            args: [testPath, largeInputFile].concat(command.slice(2)),
            expected,
            done
          });
        });

        it('succeeds when a file is piped in', (done) => {
          const file = fs.createReadStream(largeInputFile);

          const child = test({
            command: command[0],
            args: [testPath].concat(command.slice(2)),
            expected,
            done
          });

          file.pipe(child.stdin);
        });
      });
    });
  });
});
