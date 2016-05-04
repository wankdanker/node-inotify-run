var debug = require('debug')('inotify-run:launch');
var spawn = require('child_process').spawn;

module.exports = launch;

function launch (what) {
  debug(what);
  var event = what.event;
  var command = what.command;

  var p = spawn(command, [event.path, event.name, event.events.join(',')]);

  p.stdout.pipe(process.stdout);
  p.stderr.pipe(process.stderr);

  p.on('error', function (err) {
    console.error(err);
  });

  p.on('end', function (code) {
    //now what?
    debug('spawn end')
  });
}
