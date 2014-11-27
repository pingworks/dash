#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/repo.conf
. $SCRIPTDIR/../shared/common.sh
. $SCRIPTDIR/../shared/repo/${REPO}.sh

BUNDLE=$1

if [ -z "$BUNDLE" ]; then
  echo "Usage: $0 <bundle>"
  exit 1
fi
set -e
validateBundle $BUNDLE

getBundleFolder $BUNDLE
IFSOLD=$IFS


echo "Building bundle files.."
IFS=";"
exec 3< $SCRIPTDIR/../configs/bundles.csv
while read -u 3 name filter; do
  echo "  $name"
  createBundleFile $name $filter
done
exec 3<&-
IFS=$IFSOLD
echo "done."

if [ $ALWAYS_DELETE_ARTIFACTS = 1 ]; then
  echo "Removing artifacts.."
  removeAllArtifacts
  echo "done."
fi
