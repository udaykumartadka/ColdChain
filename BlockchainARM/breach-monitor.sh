#!/bin/bash

Check_Repeating_Time=10; # in seconds
Max_CPU_Usage='90.0'; #%
Max_RAM_Usage='80.0'; #%
Log_Path='/home/gethadmin/killer.log'; # path to file when killing logs will be writed

while [ 1 ]; do

    ps -aux | grep -e "geth --datadir" |
    awk '{
        Username = $1;
        Proc_Name = $11;
        CPU_Usage = $3;
        RAM_Usage = $4;
        PID = $2;
        TTY = $7;

        if( RAM_Usage >= '$Max_RAM_Usage' )
           {
            Func_Num_of_Ocur = "cat ./auto_killer_data | grep "PID" | wc -l";
            Func_Num_of_Ocur |getline Str_Num_Of_Ocur;

            if(Str_Num_Of_Ocur == "0")
            {
                system ("echo \"\" >> /dev/" TTY);
                system ("echo \"Process "Proc_Name" used to much of resources. It will be killed in '$Check_Repeating_Time' seconds if it wont stop!\" >> /dev/" TTY );
                system ("echo \"\" >> /dev/" TTY);
                system ("echo "PID" >> ./auto_killer_data.new");
            }
            else
            {
                system ("echo \"\" >> /dev/" TTY);
                system ("echo \"Process "Proc_Name" was killed because it used too much of system resources!\" >> /dev/" TTY );
                system ("echo \"\" >> /dev/" TTY);
                system ("kill -9 " PID);
                sleep 5s;
                system ("sudo kill -9 `pidof constellation-node`");
                system ("sudo nohup ./start-private-blockchain.sh ./geth.cfg Wipro@123456 &");
                Data = "date";
                Data |getline Str_Data;
                system ("echo \""Str_Data"  "Username"  "Proc_Name" "TTY" "CPU_Usage" "RAM_Usage" \" >> '$Log_Path'");
            }
        }
    }';

    if [ -e ./auto_killer_data.new ]; then
        mv ./auto_killer_data.new ./auto_killer_data
    else
        echo '' > ./auto_killer_data
    fi

    #We wait fo a while and repeate process
    sleep $Check_Repeating_Time\s;
done;
