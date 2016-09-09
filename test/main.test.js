const spawn = require('child_process').spawn;
const path = require('path');
const fs = require('fs');

const expect = require('chai').expect;

const inputFile = path.resolve('./files', 'input.txt');

const testCases = new Map();

// add test cases
testCases.set('node', 'javascript/bin/cli.js');

describe('[Main]', () => {
  const expectedResults = [
    1,
    4,
    1,
    0,
    1,
    0
  ];

  testCases.forEach((filePath, command) => {

    describe(`#${command}`, () => {

      it('succeeds with the given input file', (done) => {
        const child = spawn(command, [path.resolve('.', filePath), inputFile]);
        const chunks = [];

        child.stdout
          .on('data', (chunk) => {
            chunks.push(parseFloat(chunk.toString()));
          });

        child.on('close', (code) => {

          if (code !== 0) {
            throw new Error(`child process exited with code ${code}`);
          }

          expect(chunks).to.deep.equal(expectedResults);

          done();
        });
      });
    });
  });
});
