#!/bin/bash

function getBundleName() {
  local PNAME=$1
  local BRANCH=$2
  local REV=$3
  local BUILD_ID=$4

  BUNDLE="$PNAME.$BUILD_ID.$REV"
}
