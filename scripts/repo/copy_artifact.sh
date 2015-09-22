#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/repo.conf
. $SCRIPTDIR/../shared/common.sh
. $SCRIPTDIR/../shared/repo/${REPO}.sh

BUNDLE=$1
ARTIFACT=$2

if [ -z "$SRC_DIR" ]; then
  SRC_DIR=${JENKINS_WORKSPACE}
fi

if [ -z "$BUNDLE" ]; then
  echo "Usage: $0 <bundle> (<artifact>)"
  exit 1
fi
set -e
validateBundle $BUNDLE

getBundleFolder $BUNDLE
IFSOLD=$IFS

echo "Copying artifact into bundle.."
echo -n "  "
if [ ! -z "$ARTIFACT" -a -f "${SRC_DIR}/$ARTIFACT" ]; then
  copyArtifact ${SRC_DIR}/$ARTIFACT $ARTIFACT
  echo -n "."
fi
echo
echo "done."

