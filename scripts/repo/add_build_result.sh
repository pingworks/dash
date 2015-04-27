#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/repo.conf
. $SCRIPTDIR/../shared/common.sh
. $SCRIPTDIR/../shared/repo/${REPO}.sh

BUNDLE=$1
STAGE=$2
VALUE=$3

if [ -z "$BUNDLE" -o -z "$STAGE" -o -z "$VALUE" ]; then
  echo "Usage: $0 <bundle> <stage> <metavalue>"
  exit 1
fi   

REMOVEVALUE=$(echo $VALUE | cut -d';' -f1)

removeMetadata $BUNDLE ${STAGE}_stage_results $REMOVEVALUE
addMetadata $BUNDLE ${STAGE}_stage_results $VALUE
