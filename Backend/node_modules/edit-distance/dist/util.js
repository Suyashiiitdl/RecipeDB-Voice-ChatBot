
// Element-to-element mapping container.

// This class deferes the backtracking process to compute the mapping and may
// compute the aligment.

var Mapping;

module.exports.Mapping = Mapping = class Mapping {
  constructor(a1, b1, distance, track, backtrackFn) {
    
    // Returns the actual pairs of the mapping.

    this.pairs = this.pairs.bind(this);
    
    // Returns the alignment

    this.alignment = this.alignment.bind(this);
    this.a = a1;
    this.b = b1;
    this.distance = distance;
    this.track = track;
    this.backtrackFn = backtrackFn;
    this.pairCache = null;
  }

  pairs() {
    if (this.pairCache == null) {
      this.pairCache = this.backtrackFn(this.a, this.b, this.track);
    }
    return this.pairCache;
  }

  alignment() {
    var alignmentA, alignmentB, k, len, pair, pairs, ref;
    pairs = this.pairs();
    alignmentA = []; // B to A
    alignmentB = []; // A to B
    ref = pairs.reverse();
    for (k = 0, len = ref.length; k < len; k++) {
      pair = ref[k];
      alignmentA.push(pair[0]);
      alignmentB.push(pair[1]);
    }
    return {
      alignmentA: alignmentA,
      alignmentB: alignmentB
    };
  }

};


// Returns a zero-filled 2D array.

module.exports.zero = function(width, height) {
  var i, j, k, l, ref, ref1, x, y;
  x = new Array(width);
  for (i = k = 0, ref = width; k < ref; i = k += 1) {
    y = x[i] = new Array(height);
    for (j = l = 0, ref1 = height; l < ref1; j = l += 1) {
      y[j] = 0;
    }
  }
  return x;
};


// Computes the minimum of (a, b, c) while

module.exports.trackedMin = function(a, b, c) {
  var min;
  min = {
    value: a,
    index: 0 | 0
  };
  if (b < min.value) {
    min.value = b;
    min.index = 1 | 0;
  }
  if (c < min.value) {
    min.value = c;
    min.index = 2 | 0;
  }
  return min;
};
