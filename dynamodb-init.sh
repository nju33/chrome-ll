#!/bin/sh

set -e

endpoint_url_option=(--endpoint-url http://localhost:8000)
params=

while (( "$#" )); do
  case "$1" in
    --no-endpoint-url)
      endpoint_url=()
      shift 1
      ;;
    --)
      shift
      break
      ;;
    -*|--*=) 
      echo "Error: Unsupported flag $1" >&2
      exit 1
      ;;
    *) 
      params="$params $1"
      shift
      ;;
  esac
done

eval set -- "$params"

aws --profile nju33 dynamodb create-table \
  --table-name 'chrome-ll' \
  --attribute-definitions AttributeName=uid,AttributeType=S \
  --key-schema AttributeName=uid,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
  "${endpoint_url_option[@]}"

aws --profile nju33 dynamodb put-item \
  --table-name 'chrome-ll' \
  --item '{
    "uid": {"S": "asdf"},
    "items": {
      "L": [
        {
          "M": {
            "url": {
              "S": "https://translate.google.co.jp/?hl=ja"
            },
            "alias": {
              "S": "tl"
            }
          }
        },
        {
          "M": {
            "url": {
              "S": "https://github.com/nju33?tab=repositories"
            },
            "alias": {
              "S": "rp"
            }
          }
        }
      ]
    }
  }' \
  "${endpoint_url_option[@]}"

aws --profile nju33 dynamodb  scan \
  --table-name 'chrome-ll' \
  "${endpoint_url_option[@]}"