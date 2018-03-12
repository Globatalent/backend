#!/bin/sh

# Execute this script as source ./initSwagger.sh for export variables to global environment outside the script scope

# SpringcloudConfig Host
export CONFIG_HOST="http://localhost:8888"
env | grep '^CONFIG_HOST='
# Configuration File
export CONFIG_PATH="/globatalent-dev.json"
env | grep '^CONFIG_PATH='
# Express Api Port
export PORT="8080"
env | grep '^PORT='
# Back api url
export BACK_HOST="http://localhost:8080"
export FRONT_HOST="http://localhost:8081"
