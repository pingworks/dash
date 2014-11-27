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
dirMustExist ${BUNDLE_FOLDER}/artifacts

echo "Removing artifacts from bundle.."
removeAllArtifacts
echo "done."
