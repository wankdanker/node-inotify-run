var debug = require('debug')('inotify-run:commander')
var Inotify = require('inotify').Inotify;
var commander = require('commander');
var p = require('../package.json');

function list(val) {
  return val.split(',');
}

var program = commander
  .version(p.version)
  .option('-p, --path <value>', 'Path to watch')
  .option('-d, --depth <n>', 'How many directories deep should be watched.', parseInt)
  .option('-e, --events <list>', 'List of events to watch for; see below.', list)
  .on('--help', function () {
    console.log('\n  Debugging:')
    console.log('\n    $ DEBUG=inotify-run:* inotify-run ...');
    console.log('\n  Events:');

    Object.keys(Inotify).forEach(function (key, x) {

      if (!(x % 5)) {
        process.stdout.write('\n    ');
      }
      if (!isNaN(Inotify[key])) {
        process.stdout.write(key + ' ');
      }
    });

    console.log('\n');
  })
  .arguments('<cmd>')

program.action(function (cmd) {
    program.cmd = cmd;
  })
  .parse(process.argv)

module.exports = program;
