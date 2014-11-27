#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/repo.conf
. $SCRIPTDIR/../configs/vcs.conf
. $SCRIPTDIR/../shared/common.sh
. $SCRIPTDIR/../shared/vcs/$VCS.sh
. $SCRIPTDIR/../shared/repo/${REPO}.sh

BRANCH=$1
REV=$2
BUILDNR=$3

if [ -z "$BRANCH" -o -z "$REV" -o -z "$BUILDNR" ]; then
  echo "Usage: $0 <branch> <revision> <build_id>"
  exit 1
fi
set -e
validateBranch $BRANCH
validateRev $REV
validateBuildNr $BUILDNR

getBundleName $BRANCH $REV $BUILDNR
echo $BUNDLE