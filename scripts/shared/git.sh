#!/bin/bash

# 1: REV
function validateRev() {
  validateHash "GitRev" $1
}

function validateRevRange() {
  local RANGE=$1
  if ! echo $RANGE | grep -E '^[0-9a-f]+(\.\.[0-9a-f]+)?$' >/dev/null; then
    echo "Illegal Revision Range: $RANGE"
    exit 1
  fi
}

# 1: CMD
function validateCmd() {
  local CMD=$1
  if ! echo $CMD | grep -E "(archive)" >/dev/null; then
    echo "Illegal Git Command: $CMD"
    exit 1
  fi
}

function cloneRepo() {
  local REMOTE_REPO=$1
  local LOCAL_REPO=$2
  if [ ! -d "$LOCAL_REPO" ]; then
    createDirIfNotExists $(dirname $LOCAL_REPO)
    git clone --bare $REMOTE_REPO $LOCAL_REPO
  fi
}
