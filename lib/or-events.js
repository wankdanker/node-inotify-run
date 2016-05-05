var Inotify = require('inotify').Inotify;

module.exports = orEvents;

/*
 * orEvents(event, [event, event], event, ...)
 *
 * All arguments passed to orEvents either individually or as an array are
 * or'd together.
 */

function orEvents () {
  var mask = 0;
  var events = [];

  for (var i = 0; i < arguments.length; i++) {
    events = events.concat(arguments[i]);
  }

  events.forEach(function (event) {
    var val = Inotify[event];

    mask = mask | val;
  });

  return mask;
}
