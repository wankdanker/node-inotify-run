module.exports = arrayMatch;

function arrayMatch (a, b) {
  for (var i = 0; i < a.length; i++) {
    for (var j = 0; j < b.length; j++) {
      if (a[i] === b[j]) {
        return true;
      }
    }
  }

  return false;
}
