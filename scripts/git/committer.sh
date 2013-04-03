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

echo -e "$(bash $SCRIPTDIR/log.sh $RANGE)" \
  | grep '^Author: .*' \
  | sed -e 's/^Author: *//g' -e 's/ *<.*>$//g'
