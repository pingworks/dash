#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/repo.conf
. $SCRIPTDIR/../shared/common.sh

DRYRUN=0
VERBOSE=0
while getopts "nv" opt; do
  case $opt in
    n)
      DRYRUN=1
      ;;
    v)
      VERBOSE=1
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done
shift $(($OPTIND - 1))

BRANCH=$1

set -e
if [ ! -z "$BRANCH" ]; then
  validateBranch $BRANCH
fi

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

function cleanupBranch() {
  local BRANCH=$1
  
  local IFS=$(echo -e "\012\015 ")
  local BUNDLES_TO_DELETE BUNDLE SORTED_BUNDLES

  local -a BUNDLE_CNT
  local -a META_KEYS
  local -a META_VALUES
  local -a MAX_STATUS
  
  local i=0
  IFS=";"
  while read key value cnt; do
    if [ "${key:0:1}" = "#" -o -z "${key}" ]; then
      continue;
    fi
    META_KEYS[$i]=${key}
    META_VALUES[$i]=${value}
    MAX_STATUS[$i]=${cnt}
    BUNDLE_CNT[$i]=0
    let i=i+1
  done < $SCRIPTDIR/../configs/repo-cleanup.csv

  IFS=$(echo -e "\012\015 ")
  # sort bundles by build time
  SORTED_BUNDLES=$(getSortedBundles $BRANCH timestamp)
  
    if [ $VERBOSE -eq 1 ]; then
      echo
    fi
    for BUNDLE in $SORTED_BUNDLES; do
    if [ $VERBOSE -eq 1 ]; then
      echo -n "    $BUNDLE "
    else
      echo -n "."
    fi
    # check every 'keep this bundle' condition in BUNDLE_CNT
    for ((i=0;i<${#BUNDLE_CNT[*]};i++)); do
      if echo "$(getMetadata $BUNDLE ${META_KEYS[$i]})" | grep "${META_VALUES[$i]}" > /dev/null; then
        # keep bundle if count for this condition is below max or max is -1 (unlimited)
        if [ ${BUNDLE_CNT[$i]} -lt ${MAX_STATUS[$i]} -o ${MAX_STATUS[$i]} -lt 0 ]; then
          ((BUNDLE_CNT[$i]=${BUNDLE_CNT[$i]} + 1))
          if [ $VERBOSE -eq 1 ]; then
            echo "${META_KEYS[$i]}:${META_VALUES[$i]} ${BUNDLE_CNT[$i]}"
          fi 
          continue 2
        fi
      fi
    done
    # else: delete this bundle
    BUNDLES_TO_DELETE="${BUNDLES_TO_DELETE} ${BUNDLE}" 
    if [ $VERBOSE -eq 1 ]; then
      echo "delete"
    fi
  done
  # trim
  BUNDLES_TO_DELETE=$(echo $BUNDLES_TO_DELETE | sed -e 's/^ *//g')
  echo
  if [ ! -z "$BUNDLES_TO_DELETE" ]; then
    echo -n "    => deleting: "
    for BUNDLE in $BUNDLES_TO_DELETE; do
      getBundleFolder ${BUNDLE}
      echo -n "$BUNDLE "
      if [ $DRYRUN -eq 0 ]; then
        rm -rf ${BUNDLE_FOLDER}
      fi
    done
    echo
  fi
}

echo "Cleaning up bundles in branch: "
if [ -z "$BRANCH" ]; then
  IFSOLD=$IFS
  IFS=";"
  while read bname bnumber burl; do
    echo -n "  $bname "
    cleanupBranch $bname
  done < $SCRIPTDIR/../configs/branches.csv
  IFS=$IFSOLD
else
  echo -n "  $BRANCH "
  cleanupBranch $BRANCH
fi
echo "done."
