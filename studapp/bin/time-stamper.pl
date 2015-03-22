#!/usr/bin/perl

use strict;
use POSIX qw/strftime/;

# autoflush on
$| = 1;

# if the pipe breaks, go away.
$SIG{'PIPE'} = sub { exit(0); };

while (my $line = <STDIN>) {
    print(POSIX::strftime("%Y%m%d.%H%M%S", localtime()) . " " . $line);
}
