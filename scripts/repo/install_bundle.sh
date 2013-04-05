#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/repo.conf
. $SCRIPTDIR/../shared/common.sh

BUNDLE=$1
ENV=$2

if [ -z "$BUNDLE" ]; then
  echo "Usage: $0 <bundle> <environment>"
  exit 1
fi
if [ -z "$ENV" ]; then
  echo "Usage: $0 <bundle> <environment>"
  exit 1
fi

set -e
validateBundle $BUNDLE
validateEnv $ENV
getBundleFolder $BUNDLE

echo "Installing bundle $BUNDLE on environment $ENV .."
ARTIFACTS=$(cd ${BUNDLE_FOLDER}/artifacts/; ls )
cd ${BUNDLE_FOLDER}/artifacts/ 
scp ${ARTIFACTS} ${ENV_USER}@${ENV}:${ENV_TMP}/
for pkg in ${ARTIFACTS}; do
  ssh ${ENV_USER}@${ENV} "cd ${ENV_TMP}; ${PKGMGR} ${PKGMGR_INSTALLOPTS} $pkg"
done 
echo "done."
