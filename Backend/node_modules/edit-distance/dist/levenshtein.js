var Mapping, levenshtein, levenshteinBt, trackedMin, zero;

({Mapping, zero, trackedMin} = require('./util'));


// Computes the Levenshtein distance.

// @example
// var stringA = "abcdef";
// var stringB = "abdfgh";
// var insert = remove = function(char) { return 1; };
// var update = function(charA, charB) { return charA !== charB ? 1 : 0; };
// levenshtein(stringA, stringB, insert, remove, update);

// @see Levenshtein, Vladimir I. "Binary codes capable of correcting deletions,
// insertions and reversals." Soviet physics doklady. Vol. 10. 1966.
// @see Wagner, Robert A., and Michael J. Fischer. "The string-to-string
// correction problem." Journal of the ACM (JACM) 21.1 (1974): 168-173.

levenshtein = function(stringA, stringB, insertCb, removeCb, updateCb) {
  var a, aC, b, bC, dist, distance, i, j, k, l, m, min, n, ref, ref1, ref2, ref3, track;
  a = stringA;
  b = stringB;
  track = zero(a.length + 1, b.length + 1);
  dist = zero(a.length + 1, b.length + 1);
  for (i = k = 1, ref = a.length; k <= ref; i = k += 1) {
    dist[i][0] = i;
  }
  for (j = l = 1, ref1 = b.length; l <= ref1; j = l += 1) {
    dist[0][j] = j;
  }
  for (i = m = 1, ref2 = a.length; m <= ref2; i = m += 1) {
    for (j = n = 1, ref3 = b.length; n <= ref3; j = n += 1) {
      aC = a[i - 1];
      bC = b[j - 1];
      min = trackedMin(dist[i - 1][j] + removeCb(aC), dist[i][j - 1] + insertCb(bC), dist[i - 1][j - 1] + updateCb(aC, bC));
      track[i][j] = min.index;
      dist[i][j] = min.value;
    }
  }
  distance = dist[a.length][b.length];
  return new Mapping(a, b, distance, track, levenshteinBt);
};


// Backtracks the string-to-string mapping from lower right to upper left.

levenshteinBt = function(a, b, track) {
  var i, j, mapping;
  i = a.length;
  j = b.length;
  mapping = [];
  while (i > 0 && j > 0) {
    switch (track[i][j]) {
      case 0:
        // Remove
        mapping.push([a[i - 1], null]);
        --i;
        break;
      case 1:
        // Insert
        mapping.push([null, b[j - 1]]);
        --j;
        break;
      case 2:
        // Update
        mapping.push([a[i - 1], b[j - 1]]);
        --i;
        --j;
        break;
      default:
        throw new Error(`Invalid operation ${track[i][j]} at (${i}, ${j})`);
    }
  }
  // Handle epsilon letters.
  if (i === 0 && j !== 0) {
    while (j > 0) {
      mapping.push([null, b[j - 1]]);
      --j;
    }
  }
  if (i !== 0 && j === 0) {
    while (i > 0) {
      mapping.push([a[i - 1], null]);
      --i;
    }
  }
  return mapping;
};

module.exports = levenshtein;
