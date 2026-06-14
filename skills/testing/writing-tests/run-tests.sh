#!/bin/bash
# Run the test suite. Pass --watch, --coverage, or --ci.
set -e

ARGS=()
for arg in "$@"; do
  case $arg in
    --watch)    ARGS+=("--watch") ;;
    --coverage) ARGS+=("--coverage") ;;
    --ci)       ARGS+=("--ci" "--forceExit") ;;
  esac
done

npx jest "${ARGS[@]}"
