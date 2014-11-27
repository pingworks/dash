#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/vcs.conf
. $SCRIPTDIR/../shared/common.sh
. $SCRIPTDIR/../shared/vcs/$VCS.sh

RANGE=$1

if [ -z "$RANGE" ]; then
  echo "Usage: $0 <svn-revision-range>"
  exit 1
fi
set -e
validateRevRange $RANGE

svn log -q -r $RANGE $VCSREPO/ \
	| grep '^r.*|' \
	| cut -d '|' -f2 \
	| sed -e 's/^ *//g' -e 's/ *$//g'


