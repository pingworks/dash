#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/repo.conf
. $SCRIPTDIR/../shared/common.sh

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
while read name filter; do
  echo "  $name"
  cd $BUNDLE_FOLDER
  IFS=$IFSOLD
  tar cz -f bundles/${name}_${BUNDLE}.tar.gz ${filter}
  IFS=";" 
done < $SCRIPTDIR/../configs/bundles.csv
IFS=$IFSOLD
echo "done."

if [ $ALWAYS_DELETE_ARTIFACTS = 1 ]; then
  echo "Removing artifacts.."
  rm -rf $BUNDLE_FOLDER/artifacts
	echo "done."
fi
