#!/bin/bash

# 1: REV
function validateRev() {
  validateHash "GitRev" $1
}

function validateRevRange() {
  FOO="BAR"
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

function getCommitter() {
  local SRCDIR=$1
  local RANGE=$2

  echo -e "$(getLog $SRCDIR $RANGE)" \
    | grep '^Author: .*' \
    | sed -e 's/^Author: *//g' -e 's/ *<.*>$//g'
}

function getLog() {
  local SRCDIR=$1
  local RANGE=$2

  cd $SRCDIR
  git log $RANGE
}

function exportURL() {
  local REV=$1
  local URL=$2
  local DIR=$3

  createDirIfNotExists $DIR
  git archive $REV $URL | tar -x -C $DIR
}