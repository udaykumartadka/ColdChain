#! /bin/bash

blockchainIP=$1
blockchainpasswd=$2
contractadd=$3
bcgaslimit=$4
cd VMCronJobs/Blockchain
sudo sed -i "s/.40.117.159.33./\/${blockchainIP}:/" blockchain_services.js
sudo sed -i "s/.Wipro@123456./\"${blockchainpasswd}\"/" blockchain_services.js
sudo sed -i "s/.0x3110bc96848f05062d2c8e563da89cc26433195c./\"${contractadd}\"/" blockchain_services.js
sudo sed -i "s/.3000000./$bcgaslimit/" blockchain_services.js
sudo nohup forever start app.js
