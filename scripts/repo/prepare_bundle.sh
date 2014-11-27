#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/repo.conf
. $SCRIPTDIR/../configs/vcs.conf
. $SCRIPTDIR/../shared/common.sh
. $SCRIPTDIR/../shared/vcs/$VCS.sh

BRANCH=$1
REV=$2
BUILDNR=$3
BRANCHNAME=$4

if [ -z "$BRANCH" -o -z "$REV" -o -z "$BUILDNR" -o -z "$BRANCHNAME" ]; then
  echo "Usage: $0 <branch> <vcs-revision> <build_id>"
  exit 1
fi
set -e
validateBranch $BRANCH
validateRev $REV
validateBuildNr $BUILDNR

getBundleName $BRANCH $REV $BUILDNR
validateBundle $BUNDLE

createDirIfNotExists "${REPOBASE}/${BRANCH}"
dirMustNotExist "${REPOBASE}/${BRANCH}/${BUNDLE}"

TEMPLATEBRANCH=$BRANCH
test -d ${TEMPLATE}/${BRANCH} || TEMPLATEBRANCH=trunk
echo "Creating empty bundle $BUNDLE (using template ${TEMPLATE}/${TEMPLATEBRANCH}) ..."
rsync -ax --exclude=.svn --exclude=.git --exclude=.gitignore $SCRIPTDIR/../${TEMPLATE}/${TEMPLATEBRANCH}/ ${REPOBASE}/${BRANCH}/${BUNDLE}/
setMetadata $BUNDLE bundle $BUNDLE
setMetadata $BUNDLE timestamp $(date +%F_%T)
setMetadata $BUNDLE branch $BRANCH
setMetadata $BUNDLE branch_name $BRANCHNAME
setMetadata $BUNDLE revision $REV
setMetadata $BUNDLE buildnr $BUILDNR
setMetadata $BUNDLE changes "$(bash $SCRIPTDIR/../vcs/log.sh $REV)"
setMetadata $BUNDLE committer "$(bash $SCRIPTDIR/../vcs/committer.sh $REV)"
echo "done."

IFSOLD=$IFS
echo "Exporting configs to bundle $BUNDLE.."
IFS=";"
while read url; do
  echo "  $url"
  bash $SCRIPTDIR/../vcs/export_url.sh $BRANCH $url $REV ${REPOBASE}/${BRANCH}/${BUNDLE}/configs
done < $SCRIPTDIR/../configs/configs.csv
IFS=$IFSOLD
echo "done."
