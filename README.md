inotify-run
-----------

A cli tool that waits for inotify events and executes a command.

The arguments that are passed to the command are as follows:

* **path** - the directory in which the effected file/directory resides
* **name** - the name of the file or directory effected by the event
* **events** - a comma separated list of events that occurred

install
-------

```sh
$ npm install -g inotify-run
```

example
-------

```sh
$ inotify-run -d 1 -p /opt/images -e IN_CREATE,IN_DELETE /opt/bin/update-database.sh
```

--help
------

```sh
  Usage: index [options] <cmd>

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -p, --path <value>         Path to watch
    -d, --depth <n>            How many directories deep should be watched.
    -e, --events <list>        List of events to watch for; see below.
    -i, --include <glob-list>  List of directories to include, globstyle (minimatch)
    -x, --exclude <glob-list>  List of directories to include, globstyle (minimatch)

  Debugging:

    $ DEBUG=inotify-run:* inotify-run ...

  Events:

    IN_ACCESS IN_ATTRIB IN_CLOSE_WRITE IN_CLOSE_NOWRITE IN_CREATE
    IN_DELETE IN_DELETE_SELF IN_MODIFY IN_MOVE_SELF IN_MOVED_FROM
    IN_MOVED_TO IN_OPEN IN_IGNORED IN_ISDIR IN_Q_OVERFLOW
    IN_UNMOUNT IN_ALL_EVENTS IN_ONLYDIR IN_DONT_FOLLOW IN_ONESHOT
    IN_MASK_ADD IN_CLOSE IN_MOVE
```

license
-------

MIT
