#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/vcs.conf
. $SCRIPTDIR/../shared/common.sh
. $SCRIPTDIR/../shared/$VCS.sh

RANGE=$1

if [ -z "$RANGE" ]; then
  echo "Usage: $0 <git-revision-range>"
  exit 1
fi
set -e
validateRevRange $RANGE

OPTS=""
if ! echo $RANGE | grep '\.\.' > /dev/null; then
  OPTS="-1"
fi

cloneRepo $VCSBASE/ $VCSLOCAL
cd $VCSLOCAL
git fetch -q origin
git log $OPTS $RANGE 
