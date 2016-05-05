#!/usr/bin/env node

var debug = require('debug')('inotify-run')
var Inotify = require('inotify').Inotify;
var fileEmitter = require('dank-fileemitter');
var join = require('path').join;
var fs = require('fs');

var program = require('./lib/commander');
var resolveEvents = require('./lib/resolve-events');
var orEvents = require('./lib/or-events');
var launch = require('./lib/launch');
var arrayMatch = require('./lib/array-match');

var watching = {}; //for path lookups
var watchers = {}; //for watch number instances
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
    , watch_for : orEvents('IN_CREATE', 'IN_DELETE', events)
    , callback : function (event) {
      //this closure can not be trusted, we need to obtain the path, events
      //and depth from locally stored objects based on the event.watch number
      var wd = watchers[event.watch];
      debug(wd, 'wd');
      debug(event);
      event.path = wd.path;
      event.depth = wd.depth;
      event.file = join(wd.path, event.name || "");
      event.watchedEvents = wd.events;

      onEvent(event);
    }
  };

  debug(args);

  var wd = inotify.addWatch(args);

  //scope is lost when calling back so, we have to keep
  //track of some of things we need based on the wd number
  //returned from addWatch()
  watching[path] = watchers[wd] = {
    path : path
    , events : events
    , depth : depth
  };
}

function onEvent (event) {
  event.events = resolveEvents(event.mask);

  fs.stat(event.file, function (err, stat) {
    if (err) {
      debug(err);
      //TODO: oh well? we don't have stat?
    }

    event.stat = stat;

    if (event.stat && event.stat.isDirectory() && event.depth) {
      watchDeep(event.file, event.watchedEvents, event.depth);
    }

    //TODO: remove watch for deleted dir

    debug(event);

    //if the events that occured on this event are not in the watchedEvents
    //array then we will bail early and not launch
    if (!arrayMatch(event.events, event.watchedEvents)) {
      return;
    }

    launch({
      event : event
      , command : program.cmd
    });
  })
}
