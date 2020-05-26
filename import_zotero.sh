#!/bin/sh
#
# https://github.com/retorquere/zotero-better-bibtex/tree/master/test/fixtures/debug-bridge

js_file="import_zotero.js"
url_file=$(realpath urls.txt)

curl -s -H "Content-Type: application/javascript" -X POST --data-binary @$js_file "http://127.0.0.1:23119/debug-bridge/execute?password=pass&url_file=$url_file"
