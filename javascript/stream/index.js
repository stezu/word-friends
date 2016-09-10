const split = require('split2');
const through = require('through2');

const calculateLevenshteinDistance = require('../lib/calculateLevenshteinDistance.js');
const DISTANCE = 1;

// helper method to reduce a stream down to a single item
function streamReduce(fn, acc) {
  let result = acc;

  return through.obj(
    (chunk, enc, next) => {
      result = fn(result, chunk);

      next();
    },
    function Flush(next) {
      this.push(result);
      next();
    }
  );
}

// loop through the words we care about and find words
// with X distance using the levenshtein algorithm
function findFriends() {
  let networkUndefined = true;

  return (memo, chunk) => {

    if (chunk === 'END OF INPUT') {
      networkUndefined = false;
    } else if (networkUndefined) {
      memo.set(chunk, []);
    } else {
      memo.forEach((val, key) => {
        const distance = calculateLevenshteinDistance(key, chunk, DISTANCE);

        if (distance === DISTANCE) {
          memo.get(key).push(chunk);
        }
      });
    }

    return memo;
  };
}

// return the number of friends since that's all the output we need
function writeResults() {

  return through.obj(function Transform(chunk, enc, next) {
    chunk.forEach((result) => {
      this.push(`${result.length}\n`);
    });

    next();
  });
}

function run(inStream) {

  return inStream
    .pipe(split())
    .pipe(streamReduce(findFriends(), new Map()))
    .pipe(writeResults());
}

module.exports = run;
