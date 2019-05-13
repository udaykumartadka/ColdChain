package com.ms.beacon.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.support.v4.content.LocalBroadcastManager;

import com.ms.beacon.utils.Utility;

import timber.log.Timber;

public class NetworkChangeReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        boolean isInternetOn  = Utility.getConnectivity(context);
        Timber.v(" onreceive isInternetOn : " + isInternetOn);
        // You can also include some extra data.
        if(isInternetOn) {
            Intent i = new Intent("INTERNET_ON");
            i.putExtra("INTERNET_ON",true);
            LocalBroadcastManager.getInstance(context).sendBroadcast(i);
            Timber.v(" calling from receiver");
        }
    }
}
