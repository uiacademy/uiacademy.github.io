#!/bin/bash

set -u

bindir=`dirname $0`
hier=`cd $bindir/.. && pwd`

if test -z "$1"; then
  echo "*** usage: $0 NAME"
  exit 1
fi

DAEMON_NAME="$1"
DAEMON_CMD=${DAEMON_CMD:-}
DAEMON_PID=${DAEMON_PID:-}
DAEMON_LOG=${DAEMON_LOG:-}
SHUTDOWN_FLAG=${SHUTDOWN_FLAG:-}

if test -z "$DAEMON_CMD"; then
  echo "*** $0: bug - no DAEMON_CMD environment variable, goodbye" >&2
  exit 1
fi
if test -z "$DAEMON_PID"; then
  echo "*** $0: bug - no DAEMON_PID environment variable, goodbye" >&2
  exit 1
fi
if test -z "$DAEMON_LOG"; then
  echo "*** $0: bug - no DAEMON_LOG environment variable, goodbye" >&2
  exit 1
fi
if test -z "$SHUTDOWN_FLAG"; then
  echo "*** $0: bug - no SHUTDOWN_FLAG environment variable, goodbye" >&2
  exit 1
fi

complain() {
  _now=`date "+%Y-%m-%d %H:%M:%S"`
  echo "*** $_now $0: $@" >&2
  echo "$_now $@" | logger -p daemon.crit -t local7
}

while true; do
  # clarify start times
  printf "\f\n" >> $DAEMON_LOG
  echo "`date +%Y%m%d.%H%M%S` $0 START" >> $DAEMON_LOG

  laststart=`perl -e 'print time()'`
  pid=
  # this is a bit tricky: we have to capture java's pid, not the pid of the perl filter that's adding timestamps
  ( $DAEMON_CMD </dev/null 2>&1 & echo $! > $DAEMON_PID ) 2>&1 | $hier/bin/time-stamper.pl >> $DAEMON_LOG
  test -s $DAEMON_PID && pid=`cat $DAEMON_PID`

  wait

  # okay, how did we exit?

  # if there's a shutdown flag, exit was intentional
  if test -f $SHUTDOWN_FLAG; then
    rm -f $SHUTDOWN_FLAG
    rm -f $DAEMON_PID
    exit 0
  fi

  # not intentional
  # if we exit after running for < 60 seconds, assume a configuration problem.
  timenow=`perl -e 'print time()'`
  delta=`expr $timenow - $laststart`
  if test $delta -lt 60; then
    complain "Exiting, since respawning too fast. Daemon (pid $pid) died after $delta second(s)"
    rm -f $DAEMON_PID
    exit 1
  fi

  # not intentional, and the server was running for a while
  # oops ... let's restart it
  complain "Crashed (pid $pid) after $delta second(s), restarting."

  # back to the top and start again
done
