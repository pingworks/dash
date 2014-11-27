#!/bin/bash

# 1: REV
function validateRev() {
  validateNumber "SvnRev" $1
}

function validateRevRange() {
  local RANGE=$1
  if ! echo $RANGE | grep -E '^[0-9]+(:[0-9]+)?$' >/dev/null; then
    echo "Illegal Revision Range: $RANGE"
    exit 1
  fi
}

# 1: CMD
function validateCmd() {
  local CMD=$1
  if ! echo $CMD | grep -E "(export|checkout)" >/dev/null; then
    echo "Illegal Svn Command: $CMD"
    exit 1
  fi
}

function getCommitter() {
  local SRCDIR=$1
  local RANGE=$2

  svn log -q -r $RANGE $SRCDIR \
	| grep '^r.*|' \
	| cut -d '|' -f2 \
	| sed -e 's/^ *//g' -e 's/ *$//g'
}

function getLog() {
  local SRCDIR=$1
  local RANGE=$2

  svn log -r $RANGE $SRCDIR
}