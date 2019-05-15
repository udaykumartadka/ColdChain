#!/bin/bash

echo "===== Initializing cakeshop installation =====";
date;

#############
# Parameters
#############
if [ $# -lt 1 ]; then echo "Incomplete parameters supplied. usage: \"$0 <config file path>\""; exit 1; fi
GETH_CFG=$1;

# Load config variables
if [ ! -e $GETH_CFG ]; then echo "Config file not found. Exiting"; exit 1; fi
. $GETH_CFG

cd $HOMEDIR

#########################################
# Install cakeshop (on blockmakers only)
#########################################
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce
sudo systemctl enable docker
sleep 5
sudo curl -L "https://github.com/docker/compose/releases/download/1.11.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo docker pull jpmc/cakeshop:0.9.1

##########################################################################
# Build docker-compose configuration and application configs for cakeshop
##########################################################################
wget -N ${ARTIFACTS_URL_PREFIX}/application-properties-template || exit 1;

echo "version: '2'" > docker-compose.yml
echo "" >> docker-compose.yml
echo "services:" >> docker-compose.yml

echo '  '$IDENTITY':' >> docker-compose.yml
echo -e '    image: jpmc/cakeshop:0.9.1' >> docker-compose.yml
echo -e '    restart: always' >> docker-compose.yml
echo -e '    ports:' >> docker-compose.yml
echo -e "      - '"${CAKESHOP_STARTING_PORT}":8080'" >> docker-compose.yml

sudo docker-compose up -d $IDENTITY
CONTAINER_ID=$(sudo docker ps --filter="name=$IDENTITY" --format '{{ .ID }}')
sleep 5;
TEMP_IPADDR=`nslookup $IDENTITY | grep "Address:" | tail -n1| grep -oP '\d+\.\d+\.\d+\.\d+'`
sed s/#GETH_RPC_ADDR/$TEMP_IPADDR/ $HOMEDIR/application-properties-template > $HOMEDIR/application.properties.$IDENTITY || exit 1;
sleep 10;
sudo docker cp $HOMEDIR/application.properties.$IDENTITY $CONTAINER_ID:/opt/cakeshop/data/local/application.properties
sleep 10;
sudo docker stop $CONTAINER_ID;

# Save container ID to config so we can start cakeshop from start script
printf "%s\n" "CONTAINER_ID=$CONTAINER_ID" >> $GETH_CFG;
