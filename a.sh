#!/usr/bin/env bash

set -e

endpoint_url=http://localhost:8000
params=

while (( "$#" )); do
  case "$1" in
    --no-endpoint-url)
      endpoint_url=
      shift 1
      ;;
    -f|--flag-with-argument)
      FARG=$2
      shift 2
      ;;
    --) # end argument parsing
      echo 13
      shift
      break
      ;;
    -*|--*=) # unsupported flags
      echo "Error: Unsupported flag $1" >&2
      exit 1
      ;;
    *) # preserve positional arguments
      params="$params $1"
      echo $params
      shift
      ;;
  esac
done

eval set -- "$params"

if test -z $endpoint_url; then
fi

# if runned `bash *.sh -f ... foo bar baz`,
# $1 is foo
# $2 is bar
# $3 is baz