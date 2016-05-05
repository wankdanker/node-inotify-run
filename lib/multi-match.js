var debug = require('debug')('inotify-run:multi-match');
var minimatch = require('minimatch');

module.exports = multiMatch;

function multiMatch (path, globs) {
  //coerce globs to an array
  globs = [].concat(globs || []);

  for (var i = 0; i < globs.length; i++) {
    debug('checking %s against %s', path, globs[i], minimatch(path, globs[i]));

    if (!minimatch(path, globs[i])) {
      return false;
    }
  }

  return true;
}
