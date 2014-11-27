#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/repo.conf
. $SCRIPTDIR/../shared/common.sh
. $SCRIPTDIR/../shared/repo/${REPO}.sh

BUNDLE=$1
STAGE=$2
STATUS=$3

if [ -z "$BUNDLE" -o -z "$STAGE" -o -z "$STATUS" ]; then
  echo "Usage: $0 <bundle> <stage> <status>"
  exit 1
fi

setStageStatus $BUNDLE $STAGE $STATUS
