const spawn = require('child_process').spawn;
const path = require('path');
const fs = require('fs');

const expect = require('chai').expect;

const inputFile = path.resolve('./files', 'input.txt');
const largeInputFile = path.resolve('./files', 'largeinput.txt');

const resolve = (relativePath) => path.resolve('.', relativePath);

const testCases = new Map();

// add test cases
testCases.set('node-rx', {
  command: ['node', resolve('word-friends-javascript/lib/cli.js')],
  args: ['--rx']
});
testCases.set('node-stream', {
  command: ['node', resolve('word-friends-javascript/lib/cli.js')],
  args: ['--stream']
});
// testCases.set('ruby', {
//   command: ['ruby', resolve('word-friends-ruby/main.rb')]
// });
testCases.set('go-run', {
  command: ['go', 'run', resolve('word-friends-go/src/main.go')]
});
testCases.set('go-binary', {
  command: [resolve('word-friends-go/main')]
});
testCases.set('rust', {
  command: [resolve('word-friends-rust/target/release/word-friends-rust')]
});

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

    child.stderr
      .on('data', (chunk) => {
        console.error(chunk.toString());
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

    testCases.forEach((config, testName) => {
      describe(`#${testName}`, () => {

        it('succeeds with a filepath argument', (done) => {
          test({
            command: config.command[0],
            args: config.command.slice(1).concat([inputFile]).concat(config.args || []),
            expected,
            done
          });
        });

        it('succeeds when a file is piped in', (done) => {
          const file = fs.createReadStream(inputFile);

          const child = test({
            command: config.command[0],
            args: config.command.slice(1).concat(config.args || []),
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

    testCases.forEach((config, testName) => {
      describe(`#${testName}`, () => {

        it('succeeds with a filepath argument', (done) => {
          test({
            command: config.command[0],
            args: config.command.slice(1).concat([largeInputFile]).concat(config.args || []),
            expected,
            done
          });
        });

        it('succeeds when a file is piped in', (done) => {
          const file = fs.createReadStream(largeInputFile);

          const child = test({
            command: config.command[0],
            args: config.command.slice(1).concat(config.args || []),
            expected,
            done
          });

          file.pipe(child.stdin);
        });
      });
    });
  });
});
