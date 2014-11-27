#!/bin/bash

function getBundleFolder() {
  [ "$BUNDLE_FOLDER" ] && return # avoid re-reading branches.csv
  local BUNDLE=$1

  local IFS=";"
  BUNDLE_FOLDER=""
  if [ -d ${REPOBASE}/*/$BUNDLE ]; then
    BUNDLE_FOLDER=$(ls -d ${REPOBASE}/*/$BUNDLE)
  fi

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

function createBundleFile() {
  local name=$1
  local filter=$2
  local IFS

  validateBundle $BUNDLE
  getBundleFolder $BUNDLE

  cd $BUNDLE_FOLDER
  tar cz -f bundles/${name}_${BUNDLE}.tar.gz ${filter}
}

function removeAllArtifacts() {
  validateBundle $BUNDLE
  getBundleFolder $BUNDLE

  rm -rf $BUNDLE_FOLDER/artifacts
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
    cp -a ${SRC} ${BUNDLE_FOLDER}/artifacts/${DST}
  fi
}

function getSortedBundles() {
  local BRANCH=$1
  local SORTKEY=$2

  validateBranch $BRANCH
  validateMetakey $SORTKEY

  BUNDLES=$(ls -tc1 ${REPOBASE}/${BRANCH})
  for BUNDLE in $BUNDLES; do
    if [ -d ${REPOBASE}/${BRANCH}/${BUNDLE} ]; then
      TIMESTAMP=$(getMetadata $BUNDLE $SORTKEY);
      echo "$TIMESTAMP;$BUNDLE"
    fi
  done | sort -r | cut -d ';' -f 2
}

function createEmptyBundleFromTemplate() {
  local TPL=$1

  validateBundle $BUNDLE
  rsync -ax --exclude=.svn --exclude=.git --exclude=.gitignore $SCRIPTDIR/../${TPL}/ ${REPOBASE}/${BRANCH}/${BUNDLE}/
}

function deleteBundle() {
  validateBundle $BUNDLE
  getBundleFolder $BUNDLE
  rm -rf ${BUNDLE_FOLDER}
}
