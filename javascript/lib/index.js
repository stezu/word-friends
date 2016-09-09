const Rx = require('rx');
const RxNode = require('rx-node');
const through = require('through2');

const calculateLevenshteinDistance = require('./calculateLevenshteinDistance.js');
const DISTANCE = 1;

// our input stream can contain buffers, so we convert
// the entire input to a string to simplify our lives
function convertToString(chunk) {
  return chunk.toString();
}

// the input is line-seperated, so we split on lines
// to further simplify our lives
function splitOnLines() {
  let buffer = '';

  return {
    onNext(chunk) {
      const chunks = (buffer + chunk).split(/\r?\n/);

      buffer = chunks.pop();

      return Rx.Observable.from(chunks);
    },
    onError() {
      return Rx.Observable.empty();
    },
    onCompleted() {
      return Rx.Observable.return(buffer);
    }
  };
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

// log the output of the observable
function writeResults(chunk) {
  return `${chunk[1].length}\n`;
}

function run(inStream) {
  const outStream = through();
  const split = splitOnLines();

  const result = RxNode.fromStream(inStream)
    .map(convertToString)
    .flatMapObserver(split.onNext, split.onError, split.onCompleted)
    .reduce(findFriends(), new Map())
    .flatMap(Rx.Observable.from)
    .map(writeResults);

  RxNode.writeToStream(result, outStream);

  return outStream;
}

module.exports = run;
