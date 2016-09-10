
function getDistance(first, second) {
  const result = [[0]];

  for (let i = 1; i <= first.length; i++) {
    result[i] = [i];

    for (let j = 1; j <= second.length; j++) {
      result[0][j] = j;

      if (second[j - 1] === first[i - 1]) {
        result[i][j] = result[i - 1][j - 1]; // no operation needed
      } else {
        result[i][j] = Math.min(
          result[i - 1][j - 1] + 1, // substitution
          result[i][j - 1] + 1,     // insertion
          result[i - 1][j] + 1      // deletion
        );
      }
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
