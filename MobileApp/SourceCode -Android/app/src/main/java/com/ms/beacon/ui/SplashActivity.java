package com.ms.beacon.ui;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.IntentSender;
import android.content.IntentSender.SendIntentException;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.annotation.RequiresApi;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResult;
import com.google.android.gms.location.LocationSettingsStatusCodes;
import com.ms.beacon.R;
import com.ms.beacon.utils.Constants;
import com.ms.beacon.utils.Utility;

import java.util.List;

import okhttp3.internal.Util;
import timber.log.Timber;
import com.google.android.gms.common.api.Status;

import static android.support.v7.app.ActionBar.DISPLAY_SHOW_CUSTOM;

public class SplashActivity extends AppCompatActivity implements Utility.ActivityCallBack{
    private boolean allPermissionsGranted = false;
    private BluetoothAdapter mBluetoothAdapter;
    private LocationManager locationManager ;
    private static final int REQUEST_ENABLE_BT = 1;
    private static final int REQUEST_ENABLE_LOCATION= 2;
    private boolean isBluetoothCalled;
    private boolean isLocationCalled;
    Utility.ActivityCallBack activityCallBack;
    private GoogleApiClient googleApiClient;
    private boolean activityNotLaunched = true;

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.splash_screen);
        activityCallBack = this;

        ProgressBar pgsBar = (ProgressBar)findViewById(R.id.progressBar);
        //Utility.showDialog(getString(R.string.app_requirement),this,activityCallBack);
        // Register to receive messages.
        // We are registering an observer (mMessageReceiver) to receive Intents
        // with actions named "custom-event-name".
        if(getSupportActionBar()!= null) {
            getSupportActionBar().
                    setDisplayOptions(DISPLAY_SHOW_CUSTOM);
            getSupportActionBar().setCustomView(R.layout.topbar_layout);
            TextView actionText = (TextView ) findViewById(R.id.action_text);
            actionText.setText(R.string.app_name);
        }

    }

    @Override
    protected void onResume() {
        super.onResume();
        Timber.v("onresume");
        LocalBroadcastManager.getInstance(this).registerReceiver(broadcastReceiver,
                new IntentFilter("INTERNET_ON"));

        final BluetoothManager bluetoothManager =
                (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
        mBluetoothAdapter = bluetoothManager.getAdapter();

        IntentFilter btFilter = new IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED);
        try {
            registerReceiver(mBluetoothBroadcast, btFilter);

            registerReceiver(gpsReceiver, new IntentFilter(LocationManager.PROVIDERS_CHANGED_ACTION));
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                getPermission();
            }
        } catch (Exception e) {
            Timber.e(e.getMessage());
        }
        if(checkRequiredSettings()) {
            launchBarcodeScannerActivity();
        }

    }

    @Override
    protected void onRestart() {
        super.onRestart();
        Timber.v("onRestart");
        if(checkRequiredSettings()) {
            launchBarcodeScannerActivity();
        }
    }
    private BroadcastReceiver gpsReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().matches(LocationManager.PROVIDERS_CHANGED_ACTION)) {
                if (intent.getAction().matches("android.location.GPS_ENABLED_CHANGE"))
                {
                    boolean enabled = intent.getBooleanExtra("enabled",false);

                    Toast.makeText(context, "GPS : " + enabled,
                            Toast.LENGTH_SHORT).show();
                }
            }
        }
    };
    private final BroadcastReceiver mBluetoothBroadcast = new BroadcastReceiver() {

        @Override
        public void onReceive(Context context, Intent intent) {
            final String action = intent.getAction();

            if (action.equals(BluetoothAdapter.ACTION_STATE_CHANGED)) {
                final int state = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, BluetoothAdapter.ERROR);
                switch(state) {
                    case BluetoothAdapter.STATE_OFF:
                        break;
                    case BluetoothAdapter.STATE_TURNING_OFF:

                        break;
                    case BluetoothAdapter.STATE_ON:
                        if(checkRequiredSettings()) {
                            launchBarcodeScannerActivity();
                        }
                        break;
                    case BluetoothAdapter.STATE_TURNING_ON:
                        break;
                }

            }
        }
    };

    /*@Override
    protected void onResume() {
        super.onResume();
        Timber.v("onResume");
        if(checkRequiredSettings()) {
            launchBarcodeScannerActivity();
        }

    }*/
   BroadcastReceiver broadcastReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            boolean isInternetOn = intent.getExtras().getBoolean("INTERNET_ON");
            Timber.v("isInternetOn:" + isInternetOn);
            if(isInternetOn) {
                Timber.v("splash onreceive internet make on case ");
                    loadMainActivity();
            }
        }
    };


    @RequiresApi(api = Build.VERSION_CODES.M)
    private void getPermission() {
        requestPermissions(Constants.PERMISSION, 101);
    }
    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == 101) {
            for (int i = 0; i < grantResults.length; i++) {
                if (grantResults[i] == PackageManager.PERMISSION_GRANTED) {
                    allPermissionsGranted = true;
                    Timber.v("Granted");
                } else {
                    allPermissionsGranted = false;
                    Timber.v("Not Granted");
                    getPermission();
                    break;
                }
            }
            if(allPermissionsGranted) {
                if (!getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
                    Toast.makeText(this, R.string.ble_not_supported, Toast.LENGTH_SHORT).show();
                    finish();
                }
                else {
                    checkRequiredSettings();
                }

            }
            else {
                getPermission();
            }
        }
    }
    public boolean CheckGpsStatus(){
        locationManager = (LocationManager)this.getSystemService(Context.LOCATION_SERVICE);
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) || locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
    }
    void showAlertDialog(){
        AlertDialog.Builder builder = new AlertDialog.Builder(SplashActivity.this);
        builder.setMessage(R.string.enable_location)
                .setCancelable(false)
                .setPositiveButton(R.string.yes, new DialogInterface.OnClickListener() {
                    public void onClick(final DialogInterface dialog, int id) {
                        dialog.cancel();
                        Intent intent  = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                        startActivity(intent);
                    }
                })
                .setNegativeButton(R.string.no, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        dialog.cancel();
                    }
                });
        AlertDialog alert = builder.create();
        alert.show();
    }
    @SuppressLint("MissingPermission")
    private void loadMainActivity() {
        if (mBluetoothAdapter.isEnabled() && CheckGpsStatus() && allPermissionsGranted && activityNotLaunched) {
            launchBarcodeScannerActivity();
        }
        else {
            checkRequiredSettings();
        }
    }
    @SuppressLint("MissingPermission")
    private void launchBarcodeScannerActivity() {
      /*  if (mBluetoothAdapter.isEnabled() && CheckGpsStatus() && allPermissionsGranted) {
            new Handler().postDelayed(new Runnable() {
                @Override
                public void run() {*/
        //removeReceivers();
                    Intent i = new Intent(SplashActivity.this, BarcodeScannerActivity.class);
       // Intent i = new Intent(SplashActivity.this, GetBeaconData.class);
                    startActivity(i);
                    activityNotLaunched = false;
                    finish();
        try {
            unregisterReceiver(broadcastReceiver);
        } catch (IllegalArgumentException e) {
            Timber.e("broadcast not registered");
        }

          /*      }
            }, 1000);
        }*/
    }
    @SuppressLint("MissingPermission")
    private boolean isBluetoothOn() {
        return mBluetoothAdapter.isEnabled();
    }
    private boolean isLocationOn() {
        locationManager = (LocationManager)this.getSystemService(Context.LOCATION_SERVICE);
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) ||
                locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
    }
    private void turnOnBluetooth() {
        Timber.v("turnOnBluetooth isBluetoothCalled :" + isBluetoothCalled);
        isBluetoothCalled = true;
        Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
        startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
    }
    private void turnOnLocation() {
        Timber.v("turnOnLocation  isLocationCalled : " +isLocationCalled);
        isLocationCalled = true;
        Intent intent  = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        startActivityForResult(intent,REQUEST_ENABLE_LOCATION);
    }
    private boolean checkInternetStatus() {
        return Utility.getConnectivity(this);

    }

    private boolean checkRequiredSettings() {
        Timber.v("checkRequiredSettings");
        if(checkInternetStatus() && isBluetoothOn() && CheckGpsStatus() && allPermissionsGranted && activityNotLaunched) {
            return true;
        }
        else {
            return false;
        }
  /*      if(!checkInternetStatus()) {
            //Utility.showDialog(getString(R.string.turn_on_data),this,activityCallBack);
            Utility.displayToast(this,getString(R.string.turn_on_data));

        }
        else {
            if (!isBluetoothOn()) {
                Timber.v("Bluetoothoff");
                if(!isBluetoothCalled) {
                    Timber.v("turning on BT");
                    turnOnBluetooth();
                    //Utility.showDialog(getString(R.string.turn_on_bt), SplashActivity.this, activityCallBack);
                }
                //turnOnBluetooth();
            }
            if (!isLocationOn()) {
                Timber.v("location off");
                if(!isLocationCalled) {
                    if(Utility.hasGPSDevice(this)) {
                        Timber.v("turning on location");
                        enableLoc();
                    }
                    //Utility.showDialog(getString(R.string.turn_on_location), this, activityCallBack);
                }
                //turnOnLocation();
            }
        }*/
    }

    /*@Override
    protected void onDestroy() {
        super.onDestroy();
        try {
            unregisterReceiver(broadcastReceiver);
            unregisterReceiver(mBluetoothBroadcast);
            unregisterReceiver(gpsReceiver);
        } catch (IllegalArgumentException e) {
            Timber.e("broadcast not registered");
        }
    }*/

    @SuppressLint("MissingPermission")
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        // User chose not to enable Bluetooth.
        if (requestCode == REQUEST_ENABLE_BT && resultCode == Activity.RESULT_CANCELED && !mBluetoothAdapter.isEnabled()) {
            Utility.displayToast(this,"bluetooth must be enable for app");
            return;
        }
        if (requestCode == REQUEST_ENABLE_LOCATION && resultCode == Activity.RESULT_CANCELED && !isLocationOn()) {
            Utility.displayToast(this,"location must be enable for app");
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void turnBTOn() {
        turnOnBluetooth();
    }

    @Override
    public void turnLocationOn() {
        turnOnLocation();
    }

    private void enableLoc() {

        if (googleApiClient == null) {
            googleApiClient = new GoogleApiClient.Builder(this)
                    .addApi(LocationServices.API)
                    .addConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks() {
                        @Override                        public void onConnected(Bundle bundle) {

                        }

                        @Override                        public void onConnectionSuspended(int i) {
                            googleApiClient.connect();
                        }
                    })
                    .addOnConnectionFailedListener(new GoogleApiClient.OnConnectionFailedListener() {
                        @Override                        public void onConnectionFailed(ConnectionResult connectionResult) {

                            Timber.e("connectionResult.getErrorCode()");
                        }
                    }).build();
            googleApiClient.connect();

            LocationRequest locationRequest = LocationRequest.create();
            locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
            locationRequest.setInterval(30 * 1000);
            locationRequest.setFastestInterval(5 * 1000);
            LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder()
                    .addLocationRequest(locationRequest);

            builder.setAlwaysShow(true);

            PendingResult<LocationSettingsResult> result =
                    LocationServices.SettingsApi.checkLocationSettings(googleApiClient, builder.build());
            result.setResultCallback(new ResultCallback<LocationSettingsResult>() {
                @Override                public void onResult(LocationSettingsResult result) {
                    final Status status = result.getStatus();
                    switch (status.getStatusCode()) {
                        case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
                            try {
                                status.startResolutionForResult(SplashActivity.this, REQUEST_ENABLE_LOCATION);
                                isLocationCalled = true;
                                // Show the dialog by calling startResolutionForResult(),                                // and check the result in onActivityResult().
                            } catch (Exception e) {
                                Timber.e(e.getMessage());                           }
                                break;
                            }
                    }
                });
            }
        }
        private void removeReceivers() {
            try {
                unregisterReceiver(broadcastReceiver);
                unregisterReceiver(mBluetoothBroadcast);
                unregisterReceiver(gpsReceiver);
            } catch (IllegalArgumentException e) {
                Timber.e("broadcast not registered");
            }
        }

    @Override
    protected void onStop() {
        super.onStop();
        Timber.v("onStop");
        try {
            unregisterReceiver(broadcastReceiver);
            unregisterReceiver(mBluetoothBroadcast);
            unregisterReceiver(gpsReceiver);
        } catch (IllegalArgumentException e) {
            Timber.e("broadcast not registered");
        }
    }
}
