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
BRANCHNAME=$5
SRCDIR=$6

if [ -z "$PNAME" -o -z "$BRANCH" -o -z "$REV" -o -z "$BUILDNR" ]; then
  echo "Usage: $0 <pname> <branch> <revision> <buildnr> [<branchname>]"
  exit 1
fi
if [ -z "$BRANCHNAME" ]; then
  BRANCHNAME=$BRANCH
fi
set -e
validatePname $PNAME
validateBranch $BRANCH
validateRev $REV
validateBuildNr $BUILDNR
createLocalDirIfNotExists $JENKINS_PROPERTYFILE_DIR

getBundleName $PNAME $BRANCH $REV $BUILDNR

cat << EOF > $JENKINS_PROPERTYFILE_DIR/${BUNDLE}.properties
PNAME=${PNAME}
BUILD_DATE=$(date +%Y%m%d)
BRANCH=${BRANCH}
BRANCH_NAME=${BRANCHNAME}
REV=${REV}
BNUM=${BUILDNR}
VERSION=${BUILDNR}+${VCS}${REV}
BUNDLE=${BUNDLE}
EOF
