#!/bin/bash

echo "===== Initializing geth installation =====";
date;

############
# Parameters
############
# Validate that all arguments are supplied
if [ $# -lt 15 ]; then echo "Insufficient parameters supplied. Exiting"; exit 1; fi

AZUREUSER=$1;
PASSWD=$2;
PASSPHRASE=$3;
ARTIFACTS_URL_PREFIX=$4;
NETWORK_ID=$5;
MAX_PEERS=$6;
NODE_TYPE=$7;       # (0=Voting node; 1=Blockmaking node; 2=Observer )
GETH_IPC_PORT=$8;
NUM_VOTERS=${9};
VN_NODE_PREFIX=${10};
NUM_BLOCKMAKERS=${11};
BM_NODE_PREFIX=${12};
NUM_OBSERVERS=${13};
OB_NODE_PREFIX=${14};
NODE_SEQNUM=${15};
ADMIN_SITE_PORT=${16}; 				
CAKESHOP_FQDN=${17};   				
CAKESHOP_STARTING_PORT=${18};       

############
# Constants
############
HOMEDIR="/home/$AZUREUSER";
VMNAME=`hostname`;
GETH_HOME="$HOMEDIR/.ethereum";
mkdir -p $GETH_HOME;
ETHERADMIN_HOME="$HOMEDIR/etheradmin";
GETH_LOG_FILE_PATH="$HOMEDIR/geth.log";
GENESIS_FILE_PATH="$HOMEDIR/quorum-genesis.json";
GETH_CFG_FILE_PATH="$HOMEDIR/geth.cfg";
NODEKEY_FILE_PATH="$GETH_HOME/nodekey";
COINBASEACCOUNT="";
VOTERACCOUNT="";
BLOCKMAKERACCOUNT="";

cd $HOMEDIR

#########################################
# Install dependencies
#########################################
# install build deps
sudo add-apt-repository ppa:ethereum/ethereum -y
sudo apt-get update
sudo apt-get install -y build-essential unzip libdb-dev libsodium-dev zlib1g-dev libtinfo-dev solc sysvbanner wrk

# install constellation
wget -N https://github.com/jpmorganchase/constellation/releases/download/v0.0.1-alpha/ubuntu1604.zip
unzip ubuntu1604.zip
sudo cp ubuntu1604/constellation-node /usr/local/bin
sudo chmod 0755 /usr/local/bin/constellation-node
sudo cp ubuntu1604/constellation-enclave-keygen /usr/local/bin
sudo chmod 0755 /usr/local/bin/constellation-enclave-keygen
sudo rm -rf ubuntu1604.zip ubuntu1604

# install golang
GOREL=go1.7.3.linux-amd64.tar.gz
wget -N https://storage.googleapis.com/golang/$GOREL
tar xfz $GOREL
sudo mv go /usr/local/go
sudo rm -f $GOREL
PATH=$PATH:/usr/local/go/bin
export PATH

# make/install quorum
git clone https://github.com/jpmorganchase/quorum.git
cd quorum
git checkout tags/v1.0.2
make all
sudo cp build/bin/geth /usr/local/bin
sudo cp build/bin/bootnode /usr/local/bin
cd $HOMEDIR

# install nodejs 6.x
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs

# install quorum genesis
git clone https://github.com/davebryson/quorum-genesis.git
cd quorum-genesis
rm template.json
wget -N ${ARTIFACTS_URL_PREFIX}/template.json || exit 1;
sudo npm install -g
cd $HOMEDIR

#############
# Build node keys and node IDs
#############
declare -a NODE_KEYS
declare -a NODE_IDS
for i in `seq 0 $(($NUM_VOTERS - 1))`; do
    BOOT_NODE_HOSTNAME=$VN_NODE_PREFIX$i;
    NODE_KEYS[$i]=`echo $BOOT_NODE_HOSTNAME | sha256sum | cut -d ' ' -f 1`;
    setsid geth -nodekeyhex ${NODE_KEYS[$i]} > $HOMEDIR/tempbootnodeoutput 2>&1 &
    while sleep 10; do
        if [ -s $HOMEDIR/tempbootnodeoutput ]; then
            killall geth;
            NODE_IDS[$i]=`grep -Po '(?<=\/\/).*(?=@)' $HOMEDIR/tempbootnodeoutput`;
            rm $HOMEDIR/tempbootnodeoutput;
            if [ $? -ne 0 ]; then
                exit 1;
            fi
            break;
        fi
    done
done
for i in `seq $NUM_VOTERS $(($NUM_VOTERS + $NUM_BLOCKMAKERS - 1))`; do
    TEMP_SEQNUM=`expr $i - $NUM_VOTERS`
    BOOT_NODE_HOSTNAME=$BM_NODE_PREFIX$TEMP_SEQNUM;
    NODE_KEYS[$i]=`echo $BOOT_NODE_HOSTNAME | sha256sum | cut -d ' ' -f 1`;
    setsid geth -nodekeyhex ${NODE_KEYS[$i]} > $HOMEDIR/tempbootnodeoutput 2>&1 &
    while sleep 10; do
        if [ -s $HOMEDIR/tempbootnodeoutput ]; then
            killall geth;
            NODE_IDS[$i]=`grep -Po '(?<=\/\/).*(?=@)' $HOMEDIR/tempbootnodeoutput`;
            rm $HOMEDIR/tempbootnodeoutput;
            if [ $? -ne 0 ]; then
                exit 1;
            fi
            break;
        fi
    done
done

##################################
# Check for empty node keys or IDs
##################################
for nodekey in "${NODE_KEYS[@]}"; do
    if [ -z $nodekey ]; then
        exit 1;
    fi
done
for nodeid in "${NODE_IDS[@]}"; do
    if [ -z $nodeid ]; then
        exit 1;
    fi
done

##############################################
# Setup Genesis file and pre-allocated account
##############################################
PASSWD_FILE="$GETH_HOME/passwd.info";
printf %s $PASSWD > $PASSWD_FILE;

PRIV_KEY=`echo "$PASSPHRASE" | sha256sum | sed s/-// | sed "s/ //"`;
printf "%s" $PRIV_KEY > $HOMEDIR/temp_priv.key;
COINBASEACCOUNT=0x`geth --datadir $GETH_HOME --password $PASSWD_FILE account import $HOMEDIR/temp_priv.key | grep -oP '\{\K[^}]+'`;
echo ${VOTER_ADDRESSES[$i]}
rm $HOMEDIR/temp_priv.key;

declare -a VOTER_ADDRESSES
for i in `seq 0 $(($NUM_VOTERS - 1))`; do
    PRIV_KEY=`echo "VOTER $PASSPHRASE $VN_NODE_PREFIX $i" | sha256sum | sed s/-// | sed "s/ //"`;
    printf "%s" $PRIV_KEY > $HOMEDIR/temp_priv.key;
    VOTER_ADDRESSES[$i]=0x`geth --datadir $GETH_HOME --password $PASSWD_FILE account import $HOMEDIR/temp_priv.key | grep -oP '\{\K[^}]+'`;
    echo ${VOTER_ADDRESSES[$i]}
    rm $HOMEDIR/temp_priv.key;
done
for i in `seq $NUM_VOTERS $(($NUM_VOTERS + $NUM_BLOCKMAKERS - 1))`; do
    TEMP_SEQNUM=`expr $i - $NUM_VOTERS`
    PRIV_KEY=`echo "VOTER $PASSPHRASE $BM_NODE_PREFIX $TEMP_SEQNUM" | sha256sum | sed s/-// | sed "s/ //"`;
    printf "%s" $PRIV_KEY > $HOMEDIR/temp_priv.key;
    VOTER_ADDRESSES[$i]=0x`geth --datadir $GETH_HOME --password $PASSWD_FILE account import $HOMEDIR/temp_priv.key | grep -oP '\{\K[^}]+'`;
    echo ${VOTER_ADDRESSES[$i]}
    rm $HOMEDIR/temp_priv.key;
done

if [ $NODE_TYPE -eq 0 ]; then
    VOTERACCOUNT=${VOTER_ADDRESSES[$NODE_SEQNUM]}
fi
if [ $NODE_TYPE -eq 1 ]; then
    TEMP_SEQNUM=`expr $NODE_SEQNUM + $NUM_VOTERS`
    VOTERACCOUNT=${VOTER_ADDRESSES[$TEMP_SEQNUM]}
fi

declare -a BLOCKMAKER_ADDRESSES
for i in `seq 0 $(($NUM_BLOCKMAKERS - 1))`; do
    PRIV_KEY=`echo "BLOCKMAKER $PASSPHRASE $BM_NODE_PREFIX $i" | sha256sum | sed s/-// | sed "s/ //"`;
    printf "%s" $PRIV_KEY > $HOMEDIR/temp_priv.key;
    BLOCKMAKER_ADDRESSES[$i]=0x`geth --datadir $GETH_HOME --password $PASSWD_FILE account import $HOMEDIR/temp_priv.key | grep -oP '\{\K[^}]+'`;
    rm $HOMEDIR/temp_priv.key;
done

if [ $NODE_TYPE -eq 1 ]; then
    BLOCKMAKERACCOUNT=${BLOCKMAKER_ADDRESSES[$NODE_SEQNUM]}
fi

VOTER_STRING=""
for i in `seq 0 $(($NUM_VOTERS + $NUM_BLOCKMAKERS - 1))`; do
    TEMP_ADDRESS=${VOTER_ADDRESSES[$i]}
    VOTER_STRING="$VOTER_STRING\t\"$TEMP_ADDRESS\",\n"
done
VOTER_STRING=${VOTER_STRING::-3}

BLOCKMAKER_STRING=""
for i in `seq 0 $(($NUM_BLOCKMAKERS - 1))`; do
    TEMP_ADDRESS=${BLOCKMAKER_ADDRESSES[$i]}
    BLOCKMAKER_STRING="$BLOCKMAKER_STRING\t\"$TEMP_ADDRESS\",\n"
done
BLOCKMAKER_STRING=${BLOCKMAKER_STRING::-3}

rm $PASSWD_FILE;

wget -N ${ARTIFACTS_URL_PREFIX}/scripts/start-private-blockchain.sh || exit 1;
wget -N ${ARTIFACTS_URL_PREFIX}/quorum-config-template.json || exit 1;
# Place our calculated difficulty into genesis file
sed s/#VOTERSTRING/$VOTER_STRING/ $HOMEDIR/quorum-config-template.json > $HOMEDIR/quorum-config-temp1.json;
sed s/#MAKERSTRING/$BLOCKMAKER_STRING/ $HOMEDIR/quorum-config-temp1.json > $HOMEDIR/quorum-config-temp2.json;
sed s/#THRESHOLD/$NUM_VOTERS/ $HOMEDIR/quorum-config-temp2.json > $HOMEDIR/quorum-config.json;
rm quorum-config-temp*

# Build genesis block
quorum-genesis
cp quorum-genesis.json quorum-genesis-temp.json
sed s/#COINBASEADDR/$COINBASEACCOUNT/ $HOMEDIR/quorum-genesis-temp.json > $HOMEDIR/quorum-genesis.json

# Set up constellation config
wget -N ${ARTIFACTS_URL_PREFIX}/constellation-config-template || exit 1;
mkdir -p $HOMEDIR/data/payloads

sed s/#HOSTNAME/`hostname`/g $HOMEDIR/constellation-config-template > $HOMEDIR/constellation-config-temp1 || exit 1;

IPADDR=`ifconfig eth0 | grep "inet addr" | cut -d ':' -f 2 | cut -d ' ' -f 1`;
sed s/#IPADDRESS/$IPADDR/ $HOMEDIR/constellation-config-temp1 > $HOMEDIR/constellation-config-temp2 || exit 1;
IPCPATH=$HOMEDIR/.ethereum/geth.ipc
sed "s;#IPCPATH;$HOMEDIR/data/const.ipc;" $HOMEDIR/constellation-config-temp2 > $HOMEDIR/constellation-config-temp3 || exit 1;

echo -e "\n" | constellation-enclave-keygen `hostname`
echo -e "\n" | constellation-enclave-keygen `hostname`-archival

if [ $NODE_TYPE -eq 1 ]; then
    sed s/#BLOCKMAKERURL// $HOMEDIR/constellation-config-temp3 > $HOMEDIR/constellation-config || exit 1;
else
    BM_IPADDR=`nslookup $BM_NODE_PREFIX$((0)) | grep "Address:" | tail -n1| grep -oP '\d+\.\d+\.\d+\.\d+'`
    sed "s;#BLOCKMAKERURL;\"http://$BM_IPADDR:9001/\";" $HOMEDIR/constellation-config-temp3 > $HOMEDIR/constellation-config || exit 1;
fi
rm constellation-config-temp*

######################################
# Initialize geth for private network
######################################
if [ $NODE_TYPE -eq 0 ]; then #Boot node logic
    printf %s ${NODE_KEYS[$NODE_SEQNUM]} > $NODEKEY_FILE_PATH;
fi
if [ $NODE_TYPE -eq 1 ]; then #Boot node logic
    TEMP_SEQNUM=`expr $NODE_SEQNUM + $NUM_VOTERS`
    printf %s ${NODE_KEYS[$TEMP_SEQNUM]} > $NODEKEY_FILE_PATH;
fi

geth --datadir $GETH_HOME -verbosity 6 init $HOMEDIR/quorum-genesis.json >> $GETH_LOG_FILE_PATH 2>&1;
if [ $? -ne 0 ]; then
    exit 1;
fi
echo "===== Completed geth initialization =====";

######################
# Setup admin website
######################
mkdir -p $ETHERADMIN_HOME/views/layouts;
cd $ETHERADMIN_HOME/views/layouts;
wget -N ${ARTIFACTS_URL_PREFIX}/scripts/etheradmin/main.handlebars || exit 1;
cd $ETHERADMIN_HOME/views;
wget -N ${ARTIFACTS_URL_PREFIX}/scripts/etheradmin/etheradmin.handlebars || exit 1;
wget -N ${ARTIFACTS_URL_PREFIX}/scripts/etheradmin/etherstartup.handlebars || exit 1;
cd $ETHERADMIN_HOME;
wget -N ${ARTIFACTS_URL_PREFIX}/scripts/etheradmin/package.json || exit 1;
wget -N ${ARTIFACTS_URL_PREFIX}/scripts/etheradmin/npm-shrinkwrap.json || exit 1;
npm install || exit 1;
wget -N ${ARTIFACTS_URL_PREFIX}/scripts/etheradmin/app.js || exit 1;
mkdir $ETHERADMIN_HOME/public;
cd $ETHERADMIN_HOME/public;
wget -N ${ARTIFACTS_URL_PREFIX}/scripts/etheradmin/skeleton.css || exit 1;

##########################
# Generate boot node URLs
##########################
BOOTNODE_URLS="";
for i in `seq 0 $(($NUM_VOTERS - 1))`; do
    BOOTNODE_URLS="${BOOTNODE_URLS}enode://${NODE_IDS[$i]}@#${VN_NODE_PREFIX}${i}#:${GETH_IPC_PORT}  --bootnodes ";
done
BM_COUNTER=0
for i in `seq $NUM_VOTERS $(($NUM_VOTERS + $NUM_BLOCKMAKERS - 1))`; do
    BOOTNODE_URLS="${BOOTNODE_URLS}enode://${NODE_IDS[$i]}@#${BM_NODE_PREFIX}${BM_COUNTER}#:${GETH_IPC_PORT}";
  if [ $i -lt $(($NUM_VOTERS + $NUM_BLOCKMAKERS - 1)) ]; then
      BOOTNODE_URLS="${BOOTNODE_URLS} --bootnodes ";
  fi

  BM_COUNTER=`expr $BM_COUNTER + 1`
done

################################
# Setup registration transaction
################################
cd $HOMEDIR
wget -N ${ARTIFACTS_URL_PREFIX}/submit-registry-tx-template.js || exit 1;
PUBKEY=`cat $HOMEDIR/$VMNAME.pub`

# Determine transaction nonce
NONCE=0
if [ $NODE_TYPE -eq 1 ]; then #Blockmaker nonce
    NONCE=$NODE_SEQNUM
fi
if [ $NODE_TYPE -eq 0 ]; then #Voter node nonce
    NONCE=`expr $NODE_SEQNUM + $NUM_BLOCKMAKERS`
fi
if [ $NODE_TYPE -eq 2 ]; then #Observer nonce
    NUM_PRECEDING=`expr $NUM_VOTERS + $NUM_BLOCKMAKERS`
    NONCE=`expr $NUM_PRECEDING + $NODE_SEQNUM`
fi

sed s/#IPADDRESS/$IPADDR/ $HOMEDIR/submit-registry-tx-template.js > $HOMEDIR/submit-registry-tx-template1.js || exit 1;
sed s/#PASSWORD/$PASSWD/ $HOMEDIR/submit-registry-tx-template1.js > $HOMEDIR/submit-registry-tx-template2.js || exit 1;
sed "s;#PUBKEY;$PUBKEY;" $HOMEDIR/submit-registry-tx-template2.js > $HOMEDIR/submit-registry-tx-template3.js || exit 1;
sed s/#HOSTNAME/$VMNAME/ $HOMEDIR/submit-registry-tx-template3.js > $HOMEDIR/submit-registry-tx-template4.js || exit 1;
sed s/#NONCE/$NONCE/ $HOMEDIR/submit-registry-tx-template4.js > $HOMEDIR/submit-registry-tx.js || exit 1;
rm submit-registry-tx-template*

##################
# Create conf file
##################
printf "%s\n" "HOMEDIR=$HOMEDIR" > $GETH_CFG_FILE_PATH;
printf "%s\n" "IDENTITY=$VMNAME" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "ARTIFACTS_URL_PREFIX=$ARTIFACTS_URL_PREFIX" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "NETWORK_ID=$NETWORK_ID" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "MAX_PEERS=$MAX_PEERS" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "NODE_TYPE=$NODE_TYPE" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "BOOTNODE_URLS=\"$BOOTNODE_URLS\"" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "VN_NODE_PREFIX=$VN_NODE_PREFIX" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "NUM_VOTERS=$NUM_VOTERS" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "BM_NODE_PREFIX=$BM_NODE_PREFIX" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "NUM_BLOCKMAKERS=$NUM_BLOCKMAKERS" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "OB_NODE_PREFIX=$OB_NODE_PREFIX" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "NUM_OBSERVERS=$NUM_OBSERVERS" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "NODE_SEQNUM=$NODE_SEQNUM" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "GETH_HOME=$GETH_HOME" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "GETH_LOG_FILE_PATH=$GETH_LOG_FILE_PATH" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "VOTERACCOUNT=$VOTERACCOUNT" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "BLOCKMAKERACCOUNT=$BLOCKMAKERACCOUNT" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "COINBASEACCOUNT=$COINBASEACCOUNT" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "ETHERADMIN_HOME=$ETHERADMIN_HOME" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "ADMIN_SITE_PORT=$ADMIN_SITE_PORT" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "CAKESHOP_FQDN=$CAKESHOP_FQDN" >> $GETH_CFG_FILE_PATH;
printf "%s\n" "CAKESHOP_STARTING_PORT=$CAKESHOP_STARTING_PORT" >> $GETH_CFG_FILE_PATH;

#############
# Start geth
#############
/bin/bash $HOMEDIR/start-private-blockchain.sh $GETH_CFG_FILE_PATH $PASSWD || exit 1;

######################################################################
# Submit registry transaction to register this nodes constellation ID
######################################################################
sleep 150
echo "===== Sending registration transaction =====";
set -x;
cd $HOMEDIR
geth --exec 'loadScript("submit-registry-tx.js")' attach
if [ $? -ne 0 ]; then echo "Failed to register constellation ID. Exiting"; exit 1; fi
set +x;
echo "===== Sent registration transaction =====";

###################################################
# Install and start cakeshop
###################################################
cd $HOMEDIR
sudo -u $AZUREUSER /bin/bash -c "wget -N ${ARTIFACTS_URL_PREFIX}/scripts/configure-cakeshop.sh";
/bin/bash $HOMEDIR/configure-cakeshop.sh $GETH_CFG_FILE_PATH || exit 1;

# Wait for all nodes to register their constellation IDs before starting cakeshop
# as cakeshop will submit transactions on startup that can interfere with registration
wget -N ${ARTIFACTS_URL_PREFIX}/check-registration-complete-template.js || exit 1;
NUM_NODES=$(($NUM_VOTERS + $NUM_BLOCKMAKERS + $NUM_OBSERVERS));
sed s/#NUM_NODES/$NUM_NODES/ $HOMEDIR/check-registration-complete-template.js > $HOMEDIR/check-registration-complete.js || exit 1;
rm $HOMEDIR/check-registration-complete-template.js;
geth --exec 'loadScript("check-registration-complete.js")' attach
if [ $? -ne 0 ]; then echo "Failed to check if registration was complete. Exiting"; exit 1; fi

wget -N ${ARTIFACTS_URL_PREFIX}/scripts/start-cakeshop.sh;
/bin/bash $HOMEDIR/start-cakeshop.sh $GETH_CFG_FILE_PATH || exit 1;

###############################################
# Setup rc.local for services to start on boot
###############################################
START_CMD="#!/bin/bash\nsudo -u $AZUREUSER /bin/bash $HOMEDIR/start-private-blockchain.sh $GETH_CFG_FILE_PATH $PASSWD";
START_CMD="$START_CMD\nsudo -u $AZUREUSER /bin/bash $HOMEDIR/start-cakeshop.sh $GETH_CFG_FILE_PATH";
echo -e $START_CMD | sudo tee /etc/rc.local 2>&1 1>/dev/null
if [ $? -ne 0 ]; then
    exit 1;
fi

echo "Commands succeeded. Exiting";
exit 0;
