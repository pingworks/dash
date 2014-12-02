#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/repo.conf
. $SCRIPTDIR/../shared/common.sh
. $SCRIPTDIR/../shared/repo/${REPO}.sh

BUNDLE=$1
STAGE=$2

if [ -z "$BUNDLE" -o -z "$STAGE" ]; then
  echo "Usage: $0 <bundle> <stage>"
  exit 1
fi

setStageStatusFromResults $BUNDLE $STAGE
