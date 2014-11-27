#!/bin/bash

if [ "$REPO" = "localfs" ]; then
  SSHCMD=""
fi

function getBundleFolder() {
  [ "$BUNDLE_FOLDER" ] && return # avoid re-reading branches.csv
  local BUNDLE=$1

  BUNDLE_FOLDER=$($SSHCMD find ${REPOBASE} -maxdepth 2 -type d -name ${BUNDLE})

  if [ -z "${BUNDLE_FOLDER}" ]; then
    echo "Bundle not found: $BUNDLE"
    exit 1
  fi
}

function dirMustExist() {
  local DIR=$1
  if $SSHCMD [ ! -d "$DIR" ]; then
    echo "Directory does not exist: $DIR"
    exit 1
  fi
}

function dirMustNotExist() {
  local DIR=$1
  if $SSHCMD [ -d "$DIR" ]; then
    echo "Directory already exists: $DIR"
    exit 1
  fi
}

function createLocalDirIfNotExists() {
  local DIR=$1
  [ -d "$DIR" ] || mkdir -p "$DIR"
}

function createDirIfNotExists() {
  local DIR=$1
  $SSHCMD [ -d "$DIR" ] || $SSHCMD mkdir -p "$DIR"
}

function getMetadata() {
  local BUNDLE=$1
  local KEY=$2
  validateBundle $BUNDLE
  validateMetakey $KEY

  getBundleFolder $BUNDLE
  $SSHCMD [ -r $BUNDLE_FOLDER/metadata/$KEY ] && $SSHCMD cat $BUNDLE_FOLDER/metadata/$KEY
}

function setMetadata() {
  local BUNDLE=$1
  local KEY=$2
  local VALUE=$3
  validateBundle $BUNDLE
  validateMetakey $KEY

  getBundleFolder $BUNDLE
  echo "$VALUE" | $SSHCMD tee $BUNDLE_FOLDER/metadata/$KEY > /dev/null
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
  echo "$VALUE" | $SSHCMD tee -a $BUNDLE_FOLDER/metadata/$KEY > /dev/null
  if [ $(id -u) = 0 ] ; then
    $SSHCMD chown $REPOUSER $BUNDLE_FOLDER/metadata/$KEY
  fi
}

function writeReadmeHtml() {
  validateBundle $BUNDLE
  getBundleFolder $BUNDLE

  (
    echo "<table border="0">"
    for key in $($SSHCMD ls $BUNDLE_FOLDER/metadata); do
      value=$($SSHCMD cat $BUNDLE_FOLDER/metadata/$key)
      case $value in
	    http*) value="<a href=\"$value\">$value</a>" ;;
      esac
      echo "<tr><td>$key</td><td>$value</td></tr>"
    done
    echo "</table>"
  ) | $SSHCMD tee $BUNDLE_FOLDER/README.html > /dev/null
  if [ $(id -u) = 0 ] ; then
    $SSHCMD chown $REPOUSER $BUNDLE_FOLDER/README.html
  fi
}

function createBundleFile() {
  local name=$1
  local filter=$2
  local IFS

  validateBundle $BUNDLE
  getBundleFolder $BUNDLE

  $SSHCMD tar cz -f ${BUNDLE_FOLDER}/bundles/${name}_${BUNDLE}.tar.gz -C ${BUNDLE_FOLDER} ${filter}
}

function removeAllArtifacts() {
  validateBundle $BUNDLE
  getBundleFolder $BUNDLE

  $SSHCMD rm -rf $BUNDLE_FOLDER/artifacts
}

function copyArtifact() {
  local SRC=$1
  local DST=$2

  validateBundle $BUNDLE
  getBundleFolder $BUNDLE

  if [ ! -r ${SRC} ]; then
    echo -e "\nERROR: Artifact not found: ${SRC}"
    exit 1
  else
    $SSHCMD cp -a ${SRC} ${BUNDLE_FOLDER}/artifacts/${DST}
  fi
}

function getSortedBundles() {
  local BRANCH=$1
  local SORTKEY=$2

  validateBranch $BRANCH
  validateMetakey $SORTKEY

  BUNDLES=$($SSHCMD ls -tc1 ${REPOBASE}/${BRANCH})
  for BUNDLE in $BUNDLES; do
    if $SSHCMD [ -d ${REPOBASE}/${BRANCH}/${BUNDLE} ]; then
      TIMESTAMP=$(getMetadata $BUNDLE $SORTKEY);
      echo "$TIMESTAMP;$BUNDLE"
    fi
  done | sort -r | cut -d ';' -f 2
}

function createEmptyBundle() {

  validateBundle $BUNDLE
  $SSHCMD mkdir -p ${REPOBASE}/${BRANCH}/${BUNDLE}/{artifacts,bundles,metadata,configs}
}

function deleteBundle() {
  validateBundle $BUNDLE
  getBundleFolder $BUNDLE
  $SSHCMD rm -rf ${BUNDLE_FOLDER}
}
