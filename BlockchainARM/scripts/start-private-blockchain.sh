#!/bin/bash

#############
# Parameters
#############
if [ $# -lt 2 ]; then echo "Incomplete parameters supplied. usage: \"$0 <config file path> <ethereum account passwd>\""; exit 1; fi
GETH_CFG=$1;
PASSWD=$2;

# Load config variables
if [ ! -e $GETH_CFG ]; then echo "Config file not found. Exiting"; exit 1; fi
. $GETH_CFG

############
# Constants
############
ETHERADMIN_LOG_FILE_PATH="$HOMEDIR/etheradmin.log";

##########################################
# Ensure that at least one bootnode is up
# If not, wait 5 seconds then retry
##########################################
FOUND_BOOTNODE=false
while sleep 5; do
	for i in `seq 0 $(($NUM_VOTERS - 1))`; do
		if [ `hostname` = $VN_NODE_PREFIX$i ]; then
			continue
		fi

		LOOKUP=`nslookup $VN_NODE_PREFIX$i | grep "can't find"`
		if [ -z $LOOKUP ]; then
			FOUND_BOOTNODE=true
			break
		fi
	done

	for i in `seq 0 $(($NUM_BLOCKMAKERS - 1))`; do
		if [ `hostname` = $BM_NODE_PREFIX$i ]; then
			continue
		fi

		LOOKUP=`nslookup $BM_NODE_PREFIX$i | grep "can't find"`
		if [ -z $LOOKUP ]; then
			FOUND_BOOTNODE=true
			break
		fi
	done

	if [ "$FOUND_BOOTNODE" = true ]; then
		break
	fi
done

#######################
# Prepare geth options
#######################
# Replace hostnames in config file with IP addresses
BOOTNODE_URLS=`echo $BOOTNODE_URLS | perl -pe 's/#(.*?)#/qx\/nslookup $1| egrep "Address: [0-9]"| cut -d" " -f2 | xargs echo -n\//ge'`

# Get IP address for geth RPC binding
IPADDR=`ifconfig eth0 | grep "inet addr" | cut -d ':' -f 2 | cut -d ' ' -f 1`;

# Only mine on mining nodes
if [ $NODE_TYPE -eq 0 ]; then
  VOTE_OPTIONS="--voteaccount $VOTERACCOUNT --votepassword $PASSWD";
elif [ $NODE_TYPE -eq 1 ]; then
  BLOCKMAKER_OPTIONS="--voteaccount $VOTERACCOUNT --votepassword $PASSWD --blockmakeraccount $BLOCKMAKERACCOUNT --blockmakerpassword $PASSWD --singleblockmaker";
fi

VERBOSITY=4;

###########################
# Start constellation node
###########################
echo "===== Starting constellation node =====";
set -x;
nohup constellation-node $HOMEDIR/constellation-config 2>> $HOMEDIR/constellation.log &
if [ $? -ne 0 ]; then echo "Previous command failed. Exiting"; exit 1; fi
set +x;
echo "===== Started constellation node =====";

sleep 10

##################
# Start geth node
##################
echo "===== Starting geth node =====";
# Unlock the coinbase account so that cakeshop can interact with smart contracts
PASSWD_FILE="$GETH_HOME/passwd.info";
printf %s $PASSWD > $PASSWD_FILE;
set -x;
PRIVATE_CONFIG=$HOMEDIR/constellation-config nohup geth --datadir $GETH_HOME -verbosity $VERBOSITY --bootnodes $BOOTNODE_URLS --maxpeers $MAX_PEERS --nat none --networkid $NETWORK_ID --identity $IDENTITY $VOTE_OPTIONS $BLOCKMAKER_OPTIONS --rpc --rpcaddr "$IPADDR" --rpccorsdomain "*" --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum --unlock 0 --password $PASSWD_FILE >> $GETH_LOG_FILE_PATH 2>&1 &
if [ $? -ne 0 ]; then echo "Previous command failed. Exiting"; exit 1; fi
set +x;
# Wait for geth to startup and read the password file before deleting it
sleep 15;
rm $PASSWD_FILE;
echo "===== Started geth node =====";

#######################################
# Startup admin site
#######################################
echo "===== Starting admin webserver =====";
cd $ETHERADMIN_HOME;
nohup nodejs $ETHERADMIN_HOME/app.js $ADMIN_SITE_PORT $GETH_HOME/geth.ipc $COINBASEACCOUNT $PASSWD $BM_NODE_PREFIX $NUM_BLOCKMAKERS $VN_NODE_PREFIX $NUM_VOTERS $OB_NODE_PREFIX $NUM_OBSERVERS $CAKESHOP_FQDN $CAKESHOP_STARTING_PORT >> $ETHERADMIN_LOG_FILE_PATH 2>&1 &
if [ $? -ne 0 ]; then echo "Previous command failed. Exiting"; exit 1; fi
echo "===== Started admin webserver =====";