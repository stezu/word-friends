const spawn = require('child_process').spawn;
const path = require('path');
const fs = require('fs');

const expect = require('chai').expect;

const inputFile = path.resolve('./files', 'input.txt');

const testCases = new Map();

// add test cases
testCases.set('node-rx', ['node', 'javascript/lib/cli.js', '--rx']);
testCases.set('node-stream', ['node', 'javascript/lib/cli.js', '--stream']);

describe('[Main]', () => {
  const expectedResults = [
    1,
    4,
    1,
    0,
    1,
    0
  ];

  function test({
    command,
    args,
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

      expect(results.toString()).to.equal(expectedResults.toString());

      done();
    });

    return child;
  }

  testCases.forEach((command, testName) => {
    const testPath = path.resolve('.', command[1]);

    describe(`#${testName}`, () => {

      it('succeeds with a filepath argument', (done) => {
        test({
          command: command[0],
          args: [testPath, inputFile].concat(command.slice(2)),
          done
        });
      });

      it('succeeds when a file is piped in', (done) => {
        const file = fs.createReadStream(inputFile);

        const child = test({
          command: command[0],
          args: [testPath].concat(command.slice(2)),
          done
        });

        file.pipe(child.stdin);
      });
    });
  });
});
