#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/repo.conf
. $SCRIPTDIR/../configs/vcs.conf
. $SCRIPTDIR/../shared/common.sh
. $SCRIPTDIR/../shared/vcs/$VCS.sh
. $SCRIPTDIR/../shared/repo/${REPO}.sh

PID=$1
PNAME=$2
BUILDNR=$3
BRANCHNAME=$4
REV=$5
SRCDIR=$6
REPOLINK=$7

BRANCH=${BRANCHNAME/\//__}

function usage() {
  echo "Usage: $0 <pid> <pname> <build_nr> <branch> <vcs-revision> [<srcdir>]"
  exit 1
}

if [ -z "$PID" -o -z "$PNAME" -o -z "$BRANCHNAME" -o -z "$BUILDNR" ]; then
  usage
fi

if [ -z "$REV" ]; then
  if [ ! -z "$SRCDIR" ]; then
    REV=$(git rev-parse ${BRANCHNAME}^{commit})
  else
    usage
  fi
fi

set -e
validatePname $PNAME
validateBranch $BRANCH
validateRev $REV
validateBuildNr $BUILDNR

BUNDLE=$PID
validateBundle $BUNDLE

createDirIfNotExists "${REPOBASE}/${BRANCH}"
dirMustNotExist "${REPOBASE}/${BRANCH}/${BUNDLE}"

echo "Creating empty bundle $BUNDLE ..."
createEmptyBundle
setMetadata $BUNDLE pname $PNAME
setMetadata $BUNDLE bundle $BUNDLE
setMetadata $BUNDLE timestamp $(date +%F_%T)
setMetadata $BUNDLE branch $BRANCH
setMetadata $BUNDLE branch_name $BRANCHNAME
setMetadata $BUNDLE revision $REV
setMetadata $BUNDLE buildnr $BUILDNR
if [ ! -z "$SRCDIR" ]; then
  setMetadata $BUNDLE changes "$(getLog $SRCDIR $REV)"
  setMetadata $BUNDLE committer "$(getCommitter $SRCDIR $REV)"
fi
if [ ! -z "$REPOLINK" ]; then
  setMetadata $BUNDLE repository $REPOLINK
fi
setStageStatus $BUNDLE first in_progress
echo "done."

