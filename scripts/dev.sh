#!/usr/bin/env bash

dirname="$(dirname "$(dirname -- "$BASH_SOURCE")")"
port="33185"

export PATH="$dirname/node_modules/.bin:$PATH"

{
  now dev --listen "$port"
} &

wait
