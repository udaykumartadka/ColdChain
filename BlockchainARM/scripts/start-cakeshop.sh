#!/bin/bash

#############
# Parameters
#############
if [ $# -lt 1 ]; then echo "Incomplete parameters supplied. usage: \"$0 <config file path> <ethereum account passwd>\""; exit 1; fi
GETH_CFG=$1;

# Load config variables
if [ ! -e $GETH_CFG ]; then echo "Config file not found. Exiting"; exit 1; fi
. $GETH_CFG

###############################################
# Startup cakeshop instances
###############################################
echo "===== Starting docker container ID $CONTAINER_ID =====";
sudo docker restart $CONTAINER_ID;
echo "===== Started docker container ID $CONTAINER_ID =====";