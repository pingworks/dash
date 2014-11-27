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
