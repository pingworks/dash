#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/repo.conf
. $SCRIPTDIR/../shared/common.sh

BUNDLE=$1
KEY=$2
VALUE=$3

if [ -z "$BUNDLE" -o -z "$KEY" -o -z "$VALUE" ]; then
  echo "Usage: $0 <bundle> <metakey> <metavalue>"
  exit 1
fi

addMetadata "$BUNDLE" "$KEY" "$VALUE"

if [ $ALWAYS_UPDATE_READMEHTML = 1 ]; then
  writeReadmeHtml
fi
