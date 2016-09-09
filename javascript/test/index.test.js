const path = require('path');
const fs = require('fs');

const expect = require('chai').expect;

const main = require('../');

const inputFile = path.resolve('../files', 'input.txt');

describe('[Main]', () => {
  const expectedResults = [
    1,
    4,
    1,
    0,
    1,
    0
  ];

  function validateResults(inStream, expected, done) {
    const chunks = [];

    main(inStream)
      .on('data', (chunk) => {
        chunks.push(parseFloat(chunk.toString()));
      })
      .on('error', (err) => {
        throw err;
      })
      .on('end', () => {
        expect(chunks).to.deep.equal(expected);

        done();
      });
  }

  it('succeeds with the given input file', (done) => {
    const inStream = fs.createReadStream(inputFile);

    validateResults(inStream, expectedResults, done);
  });
});
