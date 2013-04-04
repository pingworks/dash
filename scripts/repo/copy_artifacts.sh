#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/repo.conf
. $SCRIPTDIR/../shared/common.sh

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


copyLocalArtifact() {
  local SRC=$1
  local DST=$2
  
  if [ ! -d ${SRC_DIR} -o ! -r ${SRC_DIR}/${SRC} ]; then
    echo -e "\nERROR: Artifact not found: ${SRC_DIR}/${SRC}"
    exit 1
  else
    cp -a ${SRC_DIR}/${SRC} ${BUNDLE_FOLDER}/artifacts/${DST}
    echo -n "."
  fi
}

echo "Copying artifacts into bundle.."
IFS=";"
echo -n "  "
while read src dst; do
  if [ -z "$ARTIFACT" -o "$ARTIFACT" = "$src" -o "$ARTIFACT" = "$(basename $src)" ]; then
    copyLocalArtifact $src $dst
  fi
done < $SCRIPTDIR/../configs/artifacts.csv
echo
IFS=$IFSOLD
echo "done."
