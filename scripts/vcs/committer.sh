#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/vcs.conf
. $SCRIPTDIR/../shared/common.sh
. $SCRIPTDIR/../shared/vcs/$VCS.sh

SRCDIR=$1
RANGE=$2

if [ -z "$SRCDIR" -o -z "$RANGE" ]; then
  echo "Usage: $0 <srcdir> <revision-range>"
  exit 1
fi
set -e
validateRevRange $RANGE

getCommitter $SRCDIR $RANGE