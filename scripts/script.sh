#! /bin/bash

sudo chmod +x start-private-blockchain.sh >> config-script.log

sed -i "s/.constellation-config nohup geth./constellation-config nohup geth --cache = 2048 /" start-private-blockchain.sh >> config-script.log

sudo fallocate -l 8G /swapfile >> config-script.log

ls -lh /swapfile >> config-script.log

sudo chmod 600 /swapfile >> config-script.log

ls -lh /swapfile >> config-script.log

sudo mkswap /swapfile >> config-script.log

sudo swapon /swapfile >> config-script.log

sudo free –h >> config-script.log

sudo cp /etc/fstab /etc/fstab.bak >> config-script.log

echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab >> config-script.log

sudo cat /proc/sys/vm/swappiness >> config-script.log

sudo sysctl vm.swappiness=10 >> config-script.log

sudo chmod 777 /etc/sysctl.conf

sudo echo vm.swappiness=10 >> /etc/sysctl.conf

sudo cat /proc/sys/vm/vfs_cache_pressure >> config-script.log

sudo sysctl vm.vfs_cache_pressure=50 >> config-script.log

sudo echo vm.vfs_cache_pressure=50 >> /etc/sysctl.conf

sudo chmod 644 /etc/sysctl.conf

sudo nohup ./start-private-blockchain.sh ./geth.cfg “password” &

ps –eaf | grep geth

ARTIFACTS_URL_PREFIX=$1;

wget ${ARTIFACTS_URL_PREFIX}

chmod 777 breach-monitor.sh

sudo nohup bash ./breach-monitor.sh &