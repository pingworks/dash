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
BRANCHNAME=$4
SRCDIR=$5

if [ -z "$BRANCH" -o -z "$REV" -o -z "$BUILDNR" ]; then
  echo "Usage: $0 <branch> <revision> <buildnr> [<branchname>]"
  exit 1
fi
if [ -z "$BRANCHNAME" ]; then
  BRANCHNAME=$BRANCH
fi
set -e
validateBranch $BRANCH
validateRev $REV
validateBuildNr $BUILDNR
createLocalDirIfNotExists $JENKINS_PROPERTYFILE_DIR

getBundleName $BRANCH $REV $BUILDNR

cat << EOF > $JENKINS_PROPERTYFILE_DIR/${BUNDLE}.properties
BUILD_DATE=$(date +%Y%m%d)
BRANCH=${BRANCH}
BRANCH_NAME=${BRANCHNAME}
REV=${REV}
BNUM=${BUILDNR}
VERSION=${BUILDNR}+${VCS}${REV}
BUNDLE=${BUNDLE}
EOF
