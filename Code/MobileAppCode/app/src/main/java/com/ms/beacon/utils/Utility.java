package com.ms.beacon.utils;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.ColorDrawable;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.preference.PreferenceManager;
import android.provider.Settings;
import android.util.DisplayMetrics;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;


import com.dx.dxloadingbutton.lib.LoadingButton;
import com.ms.beacon.R;

import java.util.List;
import java.util.logging.Handler;

import timber.log.Timber;

public class Utility {
    public static String getMac() {
        return mac;
    }

    public static void setMac(String mac) {
        Utility.mac = mac;
    }

    public static String mac;

    public static void saveUserLoginStatus(Context context, boolean loginStatus) {
        SharedPreferences sharedPrefs = PreferenceManager.getDefaultSharedPreferences(context);
        SharedPreferences.Editor editor;
        editor = sharedPrefs.edit();
        editor.putBoolean("", loginStatus);
        editor.commit();
    }
  /*  public static void showSuccessAnimation(String message, Context mContext) {

        new CDialog(mContext).createAlert(message,
                CDConstants.SUCCESS,   // Type of dialog
                CDConstants.NORMAL_TEXT_SIZE)    //  size of dialog
                .setAnimation(CDConstants.SCALE_FROM_BOTTOM_TO_TOP)     //  Animation for enter/exit
                .setDuration(2000)   // in milliseconds
                .setTextSize(CDConstants.NORMAL_TEXT_SIZE)
                .show();
    }
    public static void showFailureAnimation(String message, Context mContext) {

        new CDialog(mContext).createAlert(message,
                CDConstants.WARNING,   // Type of dialog
                CDConstants.MEDIUM)    //  size of dialog
                .setAnimation(CDConstants.SCALE_FROM_BOTTOM_TO_TOP)     //  Animation for enter/exit
                .setDuration(1000)   // in milliseconds
                .setTextSize(CDConstants.NORMAL_TEXT_SIZE)
                .show();
    }*/
    public static void displayToast(Context mContext, String message) {
        Toast.makeText(mContext,message,Toast.LENGTH_SHORT).show();
    }


    public static String parseBeaconAddress(String beaconAddress) {
        if(beaconAddress.contains(":")) {
            return beaconAddress.replaceAll(":", "");
        }
        return beaconAddress;
    }
    public static boolean getConnectivity(Context context) {
        NetworkInfo mConnectionInfo;
        Boolean mConnectionStatus;
        ConnectivityManager manager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        mConnectionInfo = manager.getActiveNetworkInfo();
        mConnectionStatus = mConnectionInfo != null && mConnectionInfo.isConnected() && mConnectionInfo.isAvailable();

        return mConnectionStatus;
    }

/*    public static void showResultDialog(final boolean result, Context context) {

        LayoutInflater factory = LayoutInflater.from(context);
        final View dialogView = factory.inflate(R.layout.my_result_dialog, null);

       // Button buttonOk = dialogView.findViewById(R.id.buttonOk);
        TextView displayMessage = dialogView.findViewById(R.id.result);

        final LoadingButton lb = (LoadingButton)dialogView.findViewById(R.id.loading_btn);
        lb.startLoading();

       *//* lb.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                lb.startLoading(); //start loading
            }
        });*//*
        if(result)
            displayMessage.setText("Success");
        else
            displayMessage.setText("Failure");


        final AlertDialog builder = new AlertDialog.Builder(context)
                //.setIconAttribute(android.R.attr.alertDialogIcon)
                .setView(dialogView)

                .create();
        builder.show();
        lb.loadingSuccessful();

        *//*buttonOk.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                    builder.dismiss();
            }
        });*//*
    }*/

    public static void showDialog(final String message, Context context, final ActivityCallBack activityCallBack) {

        LayoutInflater factory = LayoutInflater.from(context);
        final View dialogView = factory.inflate(R.layout.my_dialog, null);

        Button buttonOk = dialogView.findViewById(R.id.buttonOk);
        TextView displayMessage = dialogView.findViewById(R.id.displayMessage);
        if(message.equalsIgnoreCase("turn on bluetooth"))
            displayMessage.setText("Please Turn On Bluetooth for BLE communication");
           else if(message.equalsIgnoreCase("turn on location"))
            displayMessage.setText("Please Turn On Location for BLE communication");
           else
            displayMessage.setText("Please Turn On Internet");


        final AlertDialog builder = new AlertDialog.Builder(context)
                //.setIconAttribute(android.R.attr.alertDialogIcon)
                .setTitle(message)
                .setView(dialogView)

                .create();
        builder.show();

        buttonOk.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String s = "turn on bluetooth";
                String s1 = "turn on location";
                if(message.equalsIgnoreCase(s)) {
                    builder.dismiss();
                    activityCallBack.turnBTOn();

                }
                else if(message.equalsIgnoreCase(s1)){
                    builder.dismiss();
                    activityCallBack.turnLocationOn();
                }
                else {
                    builder.dismiss();
                }
            }
        });
    }

    public static void showDialogOld(final String message, Context context, final ActivityCallBack activityCallBack) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context,R.style.AlertDialogCustom);
        builder.setMessage(message)
                .setCancelable(false)
                .setPositiveButton(R.string.ok, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        String s = "turn on bluetooth";
                        String s1 = "turn on location";
                        if(message.equalsIgnoreCase(s)) {
                            activityCallBack.turnBTOn();
                        }
                        else if(message.equalsIgnoreCase(s1)){
                            activityCallBack.turnLocationOn();
                        }
                        dialog.cancel();
                    }
                });
        AlertDialog alert = builder.create();
        alert.show();
    }
    public interface ActivityCallBack {
        void turnBTOn();
        void turnLocationOn();
    }
    public static String formMacAddress(String address) {
        StringBuilder sb = new StringBuilder(address);
        if (address != null && !address.equalsIgnoreCase("")) {
            //String address = "00155D038D01";
            for (int i = 2; i < address.length() + (i / 3); i += 3) {
                sb.insert(i, ':');
            }
        }
        Timber.v("MAC Address:" + sb.toString());
        return sb.toString();
    }
    public static boolean hasGPSDevice(Context context) {
        final LocationManager mgr = (LocationManager) context
                .getSystemService(Context.LOCATION_SERVICE);
        if (mgr == null)
            return false;
        final List<String> providers = mgr.getAllProviders();
        if (providers == null)
            return false;
        return providers.contains(LocationManager.GPS_PROVIDER);
    }

}
