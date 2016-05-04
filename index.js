#!/usr/bin/env nodejs

var debug = require('debug')('inotify-run')
var Inotify = require('inotify').Inotify;
var fileEmitter = require('dank-fileemitter');
var join = require('path').join;
var fs = require('fs');

var program = require('./lib/commander');
var resolveEvents = require('./lib/resolve-events');
var orEvents = require('./lib/or-events');
var launch = require('./lib/launch');

var watching = {};
var inotify = new Inotify();

if (!program.cmd) {
  console.error('cmd is a required argument. See --help.')
  process.exit(1);
}

if (!program.events || !program.events.length) {
  program.events = ['IN_ALL_EVENTS'];
}

if (!program.path) {
  program.path = process.cwd();
}

if (!program.depth) {
  program.depth = 0;
}

//commander is not coercing depth like it should
program.depth = parseInt(program.depth);

//verify events are valid
var invalid = program.events.filter(function (event) {
  return !Inotify[event];
});

if (invalid.length) {
  console.error('Invalid event(s) to watch: %s', invalid);
  process.exit(2);
}

debug('cmd', program.cmd);
debug('events', program.events);
debug('path', program.path);
debug('depth', program.depth, typeof(program.depth));

watchDeep(program.path, program.events, program.depth);

function watchDeep(path, events, depth) {
  if (depth === 0) {
    return watchPath(path, events, depth);
  }

  if (depth === program.depth) {
    watchPath(path, events, depth);
  }

  depth -= 1;

  fileEmitter(path).on('directory', function (dir) {
    watchDeep(dir.path, program.events, depth);
  });
}

function watchPath(path, events, depth) {
  //avoid watching paths multiple times
  if (watching[path]) {
    return;
  }

  var args = {
    path : path
    , watch_for : orEvents(events)
    , callback : function (event) {
      event.path = path;
      event.depth = depth;
      event.file = join(path, event.name);
      event.watchedEvents = events;

      onEvent(event);
    }
  };

  debug(args);

  watching[path] = inotify.addWatch(args);
}

function onEvent (event) {
  event.events = resolveEvents(event.mask);

  fs.stat(event.file, function (err, stat) {
    if (err) {
      debug(err);
      //TODO: oh well? we don't have stat?
    }

    event.stat = stat;

    if (event.stat.isDirectory() && event.depth) {
      watchDeep(event.file, event.watchedEvents, event.depth);
    }

    debug(event);

    launch({
      event : event
      , command : program.cmd
    });
  })
}
