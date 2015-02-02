#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/repo.conf
. $SCRIPTDIR/../configs/vcs.conf
. $SCRIPTDIR/../shared/common.sh
. $SCRIPTDIR/../shared/vcs/$VCS.sh
. $SCRIPTDIR/../shared/repo/${REPO}.sh

PNAME=$1
BRANCH=$2
REV=$3
BUILDNR=$4

if [ -z "$PNAME" -o -z "$BRANCH" -o -z "$REV" -o -z "$BUILDNR" ]; then
  echo "Usage: $0 <pname> <branch> <revision> <build_id>"
  exit 1
fi
set -e
validatePname $PNAME
validateBranch $BRANCH
validateRev $REV
validateBuildNr $BUILDNR

getBundleName $PNAME $BRANCH $REV $BUILDNR
echo $BUNDLE