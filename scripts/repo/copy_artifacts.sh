#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/repo.conf
. $SCRIPTDIR/../shared/common.sh

BUNDLE=$1
REMOTE_HOST=$2
SRC_DIR=$3
ARTIFACTS=$4

if [ -z "$SRC_DIR" ]; then
  SRC_DIR=${JENKINS_WORKSPACE}
fi

if [ -z "$ARTIFACTS" ]; then
  ARTIFACTS=artifacts.csv
fi

if [ -z "$BUNDLE" ]; then
  echo "Usage: $0 <bundle> (<remote host> <source dir> <artifacts file>)"
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
    echo -e "\nWARNING: Artifact not found: ${SRC_DIR}/${SRC}"
  else
    cp -a ${SRC_DIR}/${SRC} ${BUNDLE_FOLDER}/artifacts/${DST}
    echo -n "."
  fi
}

copyRemoteArtifact() {
  local SRC=$1
  local DST=$2
  
  if ssh -qn ${REMOTE_HOST} "[ ! -d ${SRC_DIR} -o ! -r ${SRC_DIR}/${SRC} ]"; then
    echo -e "\nWARNING: Artifact not found: ${REMOTE_HOST}:${SRC_DIR}/${SRC}"
  else
    scp -Bqpr ${REMOTE_HOST}:${SRC_DIR}/${SRC} ${BUNDLE_FOLDER}/artifacts/${DST}
    echo -n "."
  fi
}

echo "Copying artifacts into bundle.."
IFS=";"
echo -n "  "
while read src dst; do
  if [ -z "$REMOTE_HOST" ]; then
    copyLocalArtifact $src $dst
  else
    copyRemoteArtifact $src $dst
  fi
done < $SCRIPTDIR/../configs/$ARTIFACTS
echo
IFS=$IFSOLD
echo "done."
