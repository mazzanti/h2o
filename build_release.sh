#!/usr/bin/bash

TIME=`date +%Y%m%d%H%M%S`

echo "Build release..."

cp -r src/base/js/sdk src/base/js/sdk_release

rm src/base/js/sdk_release/zmain.js

echo "Single file..."
cat src/base/js/sdk_release/*.js > src/base/js/release.js
cat src/base/js/sdk_release/form/*.js >> src/base/js/release.js
echo "var g_oGlobal = g_oGlobal || {}; g_oGlobal.release = \"$TIME\"; g_oGlobal.manager1 = new nsNessuno.oManager(\"wrapper\", \"wrapper_manager1\"); g_oGlobal.manager1.setOwner(g_oGlobal.manager1);" >> src/base/js/release.js

echo "Minifier..."
minify src/base/js/release.js --template {{filename}}.{{ext}}
#minify src\base\js\release.js


