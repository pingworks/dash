#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/vcs.conf
. $SCRIPTDIR/../shared/common.sh
. $SCRIPTDIR/../shared/$VCS.sh

BRANCH=$1
URL=$2
REV=$3
DIR=$4

if [ -z "$BRANCH" -o -z "$URL" -o -z "$REV" -o -z "$DIR" ]; then
  echo "Usage: $0 <branch> <url> <git-revision> <exportdir>"
  exit 1
fi
set -e
validateBranch $BRANCH
validateRev $REV
dirMustExist $(dirname $DIR)
createDirIfNotExists $DIR

git archive $BRANCH $URL | tar -x -C $DIR