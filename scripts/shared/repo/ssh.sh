#!/bin/bash

if [ -z "$SSHCMD" ]; then
  echo "ERROR: SSHCMD not set in configuration."
  exit 1
fi

. $SCRIPTDIR/../shared/repo/localfs.sh
