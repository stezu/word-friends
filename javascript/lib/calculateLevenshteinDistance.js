
function getDistance(first, second) {
  const result = [[0]];

  for (let i = 1; i <= first.length; i++) {
    result[i] = [i];

    for (let j = 1; j <= second.length; j++) {
      result[0][j] = j;

      result[i][j] = second.charAt(j - 1) === first.charAt(i - 1) ?
        result[i - 1][j - 1] :
        Math.min(
          result[i - 1][j - 1] + 1,
          result[i][j - 1] + 1,
          result[i - 1][j] + 1
        );
    }
  }

  return result[first.length][second.length];
}

function calculateLevenshteinDistance(first, second, maxDistance) {

  // if one of the words doesn't exist, the distance
  // is the length of the other word
  if (!first || !second) {
    return (first || second).length;
  }

  // if the word length is further apart than the expected distance
  // we don't need to calculate the levenshtein distance, fail early
  if (Math.abs(first.length - second.length) > maxDistance) {
    return null;
  }

  return getDistance(first, second);
}

module.exports = calculateLevenshteinDistance;
