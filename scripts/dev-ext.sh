#!/usr/bin/env bash

set -euo pipefail

clean() {
  set -x
  kill -9 "$(jobs -p)"
  set +x
}

trap 'clean' ERR EXIT

dirname="$(dirname -- "$(dirname -- "${BASH_SOURCE:-$0}")")"

export PATH="$dirname/node_modules/.bin;$PATH"

set -x
webpack-dev-server --config "$dirname/webpack.__background.config.js" &
webpack-dev-server --config "$dirname/webpack.__popup.config.js" &
set +x

wait
