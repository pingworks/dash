#!/bin/bash

if [ -z "$SSHCMD" -o -z "$SCPCMD" -o -z "$SSHLOGIN" ]; then
  echo "ERROR: SSH configuration not correctly set."
  exit 1
fi

. $SCRIPTDIR/../shared/repo/localfs.sh

function copyArtifact() {
  local SRC=$1
  local DST=$2

  validateBundle $BUNDLE
  getBundleFolder $BUNDLE

  if [ ! -r ${SRC} ]; then
    echo -e "\nERROR: Artifact not found: ${SRC}"
    exit 1
  else
    $SCPCMD ${SRC} ${SSHLOGIN}:${BUNDLE_FOLDER}/artifacts/${DST}
  fi
}

function setMetadata() {
  local BUNDLE=$1
  local KEY=$2
  local VALUE=$3
  validateBundle $BUNDLE
  validateMetakey $KEY

  getBundleFolder $BUNDLE
  $SSHCMD "flock -w $LOCK_TIMEOUT $BUNDLE_FOLDER/metadata/$KEY \
        -c 'echo \"$VALUE\" > $BUNDLE_FOLDER/metadata/$KEY'"
  if [ $(id -u) = 0 ] ; then
    $SSHCMD chown $REPOUSER $BUNDLE_FOLDER/metadata/$KEY
  fi
}

function addMetadata() {
  local BUNDLE=$1
  local KEY=$2
  local VALUE=$3
  validateBundle $BUNDLE
  validateMetakey $KEY

  getBundleFolder $BUNDLE
  $SSHCMD "flock -w $LOCK_TIMEOUT $BUNDLE_FOLDER/metadata/$KEY \
        -c 'echo \"$VALUE\" >> $BUNDLE_FOLDER/metadata/$KEY'"
  if [ $(id -u) = 0 ] ; then
    $SSHCMD chown $REPOUSER $BUNDLE_FOLDER/metadata/$KEY
  fi
}

function removeMetadata() {
  local BUNDLE=$1
  local KEY=$2
  local VALUE=$3
  validateBundle $BUNDLE
  validateMetakey $KEY

  getBundleFolder $BUNDLE
  $SSHCMD "flock -w $LOCK_TIMEOUT $BUNDLE_FOLDER/metadata/$KEY \
        -c 'sed -i -e \'/^${VALUE}/d\' $BUNDLE_FOLDER/metadata/$KEY'"
  if [ $(id -u) = 0 ] ; then
    $SSHCMD chown $REPOUSER $BUNDLE_FOLDER/metadata/$KEY
  fi
}
