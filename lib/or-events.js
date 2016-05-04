var Inotify = require('inotify').Inotify;

module.exports = orEvents;

function orEvents (events) {
  var mask = 0;

  events.forEach(function (event) {
    var val = Inotify[event];

    mask = mask | val;
  });

  return mask;
}
