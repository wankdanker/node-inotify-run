var Inotify = require('inotify').Inotify;

module.exports = resolveEvents;

function resolveEvents (mask) {
  var events = [];

  Object.keys(Inotify).forEach(function (event) {
    var val = Inotify[event];

    if (mask & val) {
      events.push(event);
    }
  });

  return events;
}
