var debug = require('debug')('inotify-run:commander')
var commander = require('commander');

function list(val) {
  return val.split(',');
}

var program = commander
  .version('1.0.0')
  .option('-p, --path <value>', 'Path to watch')
  .option('-d, --depth <n>', parseInt)
  .option('-e, --events <list>', 'List of events to watch for.', list)
  .arguments('<cmd>')

program.action(function (cmd) {
    program.cmd = cmd;
  })
  .parse(process.argv)

module.exports = program;
