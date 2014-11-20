#!/bin/bash

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

function getBranchNr() {
  local BRANCH=$1
  local IFS=";"
  
  while read name nr url; do
    if [ "$name" = "$BRANCH" ]; then
      BRANCHNR=$nr
    fi  
  done < $SCRIPTDIR/../configs/branches.csv
  
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
  
  while read name nr url; do
    if [ "$name" = "$BRANCH" ]; then
      BRANCHURL=$url
    fi  
  done < $SCRIPTDIR/../configs/branches.csv
  
  if [ -z "$BRANCHURL" -a "$VCS" != "git" ]; then
    echo "No BRANCHURL found for BRANCH: $BRANCH"
    exit 1
  fi
}

# from BUNDLE, sets BRANCH BRANCHNR BRANCHURL
function getBranch() {
  local IFS=";"
  BRANCHNR=$(echo "$BUNDLE" | cut -d . -f 1)
  while read name nr url; do
    if [ "$nr" = "$BRANCHNR" ]; then
      BRANCH="$name"
      BRANCHURL="$url"
    fi
  done < $SCRIPTDIR/../configs/branches.csv

  if [ -z "$BRANCH" ]; then
    echo "No BRANCH found for BUNDLE: $BUNDLE"
    exit 1
  fi
}

function getBundleName() {
  local BRANCH=$1
  local REV=$2
  local BUILD_ID=$3
  
  getBranchNr $BRANCH
  BUNDLE="$BRANCHNR.$REV.$BUILD_ID"
}

function getBundleFolder() {
  [ "$BUNDLE_FOLDER" ] && return # avoid re-reading branches.csv
  local BUNDLE=$1
  
  local IFS=";"
  BUNDLE_FOLDER=""
  while read bname bnumber burl; do
  if [ -d "${REPOBASE}/${bname}/$BUNDLE" ]; then
    BUNDLE_FOLDER=${REPOBASE}/${bname}/$BUNDLE
  fi
  done < $SCRIPTDIR/../configs/branches.csv
  
  if [ -z "${BUNDLE_FOLDER}" ]; then
    echo "Bundle not found: $BUNDLE"
    exit 1
  fi
}

function dirMustExist() {
  local DIR=$1
  if [ ! -d "$DIR" ]; then
    echo "Directory does not exist: $DIR"
    exit 1
  fi
}

function dirMustNotExist() {
  local DIR=$1
  if [ -d "$DIR" ]; then
    echo "Directory already exists: $DIR"
    exit 1
  fi
}

function createDirIfNotExists() {
  local DIR=$1
  [ -d "$DIR" ] || mkdir -p "$DIR"
}

function getMetadata() {
  local BUNDLE=$1
  local KEY=$2
  validateBundle $BUNDLE
  validateMetakey $KEY
  
  getBundleFolder $BUNDLE
  [ -r $BUNDLE_FOLDER/metadata/$KEY ] && cat $BUNDLE_FOLDER/metadata/$KEY
}

function setMetadata() {
  local BUNDLE=$1
  local KEY=$2
  local VALUE=$3
  validateBundle $BUNDLE
  validateMetakey $KEY
  
  getBundleFolder $BUNDLE
  echo "$VALUE" > $BUNDLE_FOLDER/metadata/$KEY
  if [ $(id -u) = 0 ] ; then
    chown $REPOUSER $BUNDLE_FOLDER/metadata/$KEY
  fi
}

function addMetadata() {
  local BUNDLE=$1
  local KEY=$2
  local VALUE=$3
  validateBundle $BUNDLE
  validateMetakey $KEY
  
  getBundleFolder $BUNDLE
  echo "$VALUE" >> $BUNDLE_FOLDER/metadata/$KEY
  if [ $(id -u) = 0 ] ; then
    chown $REPOUSER $BUNDLE_FOLDER/metadata/$KEY
  fi
}

function writeReadmeHtml() {
  validateBundle $BUNDLE
  if [ -z "${BRANCH:-}" ] ; then
    getBranch
  fi
  getBundleFolder $BUNDLE

  (
    echo "<table border="0">"
    for key in $(ls $BUNDLE_FOLDER/metadata); do
      value=$(<$BUNDLE_FOLDER/metadata/$key)
      case $value in
	http*) value="<a href=\"$value\">$value</a>" ;;
      esac
      echo "<tr><td>$key</td><td>$value</td></tr>"
    done
    echo "</table>"
  ) > $BUNDLE_FOLDER/README.html
  if [ $(id -u) = 0 ] ; then
    chown $REPOUSER $BUNDLE_FOLDER/README.html
  fi
}
