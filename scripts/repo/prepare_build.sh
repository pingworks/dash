#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/repo.conf
. $SCRIPTDIR/../configs/vcs.conf
. $SCRIPTDIR/../shared/common.sh
. $SCRIPTDIR/../shared/$VCS.sh

BRANCH=$1
REV=$2
BUILDNR=$3
BRANCHNAME=$4

if [ -z "$BRANCH" -o -z "$REV" -o -z "$BUILDNR" ]; then
  echo "Usage: $0 <branch> <revision> <build_id>"
  exit 1
fi
if [ -z "$BRANCHNAME" ]; then
  BRANCHNAME=$BRANCH
fi
set -e
validateBranch $BRANCH
validateRev $REV
validateBuildNr $BUILDNR
createDirIfNotExists $JENKINS_PROPERTYFILE_DIR

getBundleName $BRANCH $REV $BUILDNR
getBranchNr $BRANCH
getBranchUrl $BRANCH
bash ${SCRIPTDIR}/../repo/prepare_bundle.sh $BRANCH $REV $BUILDNR $BRANCHNAME

cat << EOF > $JENKINS_PROPERTYFILE_DIR/${BUNDLE}.properties
BUILD_DATE=$(date +%Y%m%d)
BRANCH=${BRANCH}
BRANCH_NUM=${BRANCHNR}
BRANCH_URL=${BRANCHURL}
BRANCH_NAME=${BRANCHNAME}
REV=${REV}
BNUM=${BUILDNR}
VERSION=${BRANCHNR}+${VCS}${BUILD_DATE}.${REV}-${BUILDNR}
BUNDLE=${BUNDLE}
EOF

cp $JENKINS_PROPERTYFILE_DIR/${BUNDLE}.properties $JENKINS_PROPERTYFILE_DIR/${BUILDNR}.properties

bash ${SCRIPTDIR}/../repo/add_metadata.sh ${BUNDLE} status first_stage_in_progress
