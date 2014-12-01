#!/bin/bash

function getBundleName() {
  local BRANCH=$1
  local REV=$2
  local BUILD_ID=$3

  BUNDLE="$BUILD_ID.$REV"
}
