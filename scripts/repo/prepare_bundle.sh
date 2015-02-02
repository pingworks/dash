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

if [ -z "$PNAME" -o -z "$BRANCH" -o -z "$REV" -o -z "$BUILDNR" -o -z "$BRANCHNAME" ]; then
  echo "Usage: $0 <pname> <branch> <vcs-revision> <build_nr> <branchname> [<srcdir>]"
  exit 1
fi
set -e
validatePname $PNAME
validateBranch $BRANCH
validateRev $REV
validateBuildNr $BUILDNR

getBundleName $PNAME $BRANCH $REV $BUILDNR
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
echo "done."

IFSOLD=$IFS
echo "Exporting configs to bundle $BUNDLE.."
IFS=";"
exec 3< $SCRIPTDIR/../configs/configs.csv
while read -u 3 url; do
  IFSOLD=$IFS
  echo "  $url"
  bash $SCRIPTDIR/../vcs/export_url.sh $BRANCH $url $REV ${REPOBASE}/${BRANCH}/${BUNDLE}/configs
  IFS=";"
done
exec 3<&-
IFS=$IFSOLD
echo "done."
