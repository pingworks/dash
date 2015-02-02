#!/bin/bash

. $SCRIPTDIR/../configs/bundlename.sh

set -E
trap 'handleError ${?}' ERR
trap 'handleExit ${?}' EXIT

function errorInfo() {
  local type="$1"
  local suffix="$2"
  local lasterr="$3"

  local script="$0"
  local file="${BASH_SOURCE[2]}"
  local funcname="${FUNCNAME[2]}"
  local lastline="${BASH_LINENO[2]}"

  echo "##################################################"
  echo "# ${type}: SCRIPT FAILED"
  echo "##################################################"
  echo "# Script:    ${script}"
  echo "# File:      ${file}"
  echo "# Function:  ${funcname}"
  echo "# Line:      ${lastline}"
  echo "# Exit Code: ${lasterr}"
  echo
  echo "${suffix}"
  echo
}

function handleError() {
  local lasterr="$1"

  local script="$0"
  # remove exit handler to avoid double output
  trap - EXIT
  if [ $ONLYWARNONERROR -eq 1 ]; then
    errorInfo "WARNING" "Exiting gracefully." ${lasterr}
    exit 0
  else
    errorInfo "ERROR" "Exiting with 1" ${lasterr}
    exit 1
  fi
}

function handleExit() {
  local lasterr="$1"

  local script="$0"
  # if there was no error simply exit
  [ $lasterr -eq 0 ] && exit 0
  if [ $ONLYWARNONERROR -eq 1 ]; then
    errorInfo "WARNING" "Exiting gracefully." ${lasterr}
    exit 0
  else
    errorInfo "ERROR" "Exiting with 1" ${lasterr}
    exit 1
  fi
}

function validateNumber() {
  local LABEL=$1
  local NR=$2
  if ! echo $NR | grep -E '^[0-9]+$' >/dev/null; then
    echo "Illegal $LABEL: $NR"
    exit 1
  fi
}

function validateHash() {
  local LABEL=$1
  local HASH=$2
  if ! echo $HASH | grep -E '^[0-9a-z]+$' >/dev/null; then
    echo "Illegal $LABEL: $HASH"
    exit 1
  fi
}

# 1: BUILD_ID
function validateBuildNr() {
  validateNumber "BuildNr" $1
}

# 1: BUNDLE
function validateBundle() {
  local BUNDLE=$1
  if ! echo $BUNDLE | grep -E "$BUNDLE_PATTERN" >/dev/null; then
    echo "Illegal BUNDLE: $BUNDLE"
    exit 1
  fi
}

# 1: BRANCH
function validatePname() {
  local PNAME=$1
  if ! echo $PNAME | grep -E "$PNAME_PATTERN" >/dev/null; then
    echo "Illegal PNAME: $PNAME"
    exit 1
  fi
}

# 1: BRANCH
function validateBranch() {
  local BRANCH=$1
  if ! echo $BRANCH | grep -E "$BRANCH_PATTERN" >/dev/null; then
    echo "Illegal BRANCH: $BRANCH"
    exit 1
  fi
}

# 1: KEY
function validateMetakey() {
  local KEY=$1
  if ! grep -E "^$KEY;" $SCRIPTDIR/../configs/metakeys.csv >/dev/null; then
    echo "Illegal Meta Key: $KEY"
    exit 1
  fi
}

function validateEnv() {
  local ENV=$1
  
  if ! echo $ENV | grep -E "$ENV_PATTERN" >/dev/null; then
    echo "Illegal ENV: $ENV"
    exit 1
  fi
}

function validateStage() {
  local STAGE=$1

  if ! echo $STAGE | grep -E "$STAGE_PATTERN" >/dev/null; then
    echo "Illegal STAGE: $STAGE"
    exit 1
  fi
}

function validateStatus() {
  local STATUS=$1

  if ! echo $STATUS | grep -E "$STATUS_PATTERN" >/dev/null; then
    echo "Illegal STATUS: $STATUS"
    exit 1
  fi
}

function getBranchNr() {
  local BRANCH=$1
  local IFS=";"

  exec 3< $SCRIPTDIR/../configs/branches.csv
  while read -u 3 name nr url; do
    if [ "$name" = "$BRANCH" ]; then
      BRANCHNR=$nr
    fi  
  done
  exec 3<&-
  
  if [ -z "$BRANCHNR" ]; then
    echo "No BRANCHNR found for BRANCH: $BRANCH"
    if [ ! -z "$BRANCHNR_FALLBACK" ]; then
      BRANCHNR=$BRANCHNR_FALLBACK
    else
      exit 1
    fi
  fi
}

function getBranchUrl() {
  local BRANCH=$1
  local IFS=";"

  exec 3< $SCRIPTDIR/../configs/branches.csv
  while read -u 3 name nr url; do
    if [ "$name" = "$BRANCH" ]; then
      BRANCHURL=$url
    fi  
  done
  exec 3<&-
  
  if [ -z "$BRANCHURL" -a "$VCS" != "git" ]; then
    echo "No BRANCHURL found for BRANCH: $BRANCH"
    exit 1
  fi
}

# from BUNDLE, sets BRANCH BRANCHNR BRANCHURL
function getBranch() {
  local IFS=";"
  BRANCHNR=$(echo "$BUNDLE" | cut -d . -f 1)
  exec 3< $SCRIPTDIR/../configs/branches.csv
  while read -u 3 name nr url; do
    if [ "$nr" = "$BRANCHNR" ]; then
      BRANCH="$name"
      BRANCHURL="$url"
    fi
  done
  exec 3<&-

  if [ -z "$BRANCH" ]; then
    echo "No BRANCH found for BUNDLE: $BUNDLE"
    exit 1
  fi
}

function setStageStatusFromResults() {
  local BUNDLE=$1
  local STAGE=$2

  validateBundle $BUNDLE
  validateStage $STAGE

  SUCCESS="passed"
  if echo "$(getMetadata ${BUNDLE} ${STAGE}_stage_results)" | grep FAILURE > /dev/null; then
    SUCCESS="failed"
  fi
  setStageStatus ${BUNDLE} ${STAGE} ${SUCCESS}
}

function setStageStatus() {
  local BUNDLE=$1
  local STAGE=$2
  local STATUS=$3

  validateBundle $BUNDLE
  validateStage $STAGE
  validateStatus $STATUS

  addMetadata "$BUNDLE" "status" "${STAGE}_stage_${STATUS}"
}