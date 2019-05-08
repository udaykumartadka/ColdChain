package com.ms.beacon.ui;

import android.app.ProgressDialog;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothProfile;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.dx.dxloadingbutton.lib.LoadingButton;
import com.ms.beacon.R;
import com.ms.beacon.model.ProductData;
import com.ms.beacon.service.BluetoothLeService;
import com.ms.beacon.utils.Utility;

import java.util.concurrent.ExecutorService;

import timber.log.Timber;

import static android.bluetooth.BluetoothAdapter.STATE_CONNECTED;
import static android.bluetooth.BluetoothAdapter.STATE_DISCONNECTED;
import static android.support.v7.app.ActionBar.DISPLAY_SHOW_CUSTOM;
import static android.view.View.VISIBLE;
import static com.ms.beacon.utils.Constants.ACTION_DATA_AVAILABLE;
import static com.ms.beacon.utils.Constants.ACTION_GATT_CONNECTED;
import static com.ms.beacon.utils.Constants.ACTION_GATT_DISCONNECTED;
import static com.ms.beacon.utils.Constants.ACTION_GATT_SERVICES_DISCOVERED;
import static com.ms.beacon.utils.Constants.EXTRA_BLUETOOTH_DEVICE_ADDRESS;


public class BeaconDataActivity extends AppCompatActivity implements BluetoothLeService.ServiceResponseCallBack{
    private static final String TAG = BeaconDataActivity.class.getSimpleName().toString();
    private static BluetoothLeService mBluetoothLeService;
    private String macAddress;
    private boolean mConnected;
    //private ProgressDialog mSpinner;
    private int mConnectionState = STATE_DISCONNECTED;
    private BluetoothGatt mBluetoothGatt;
    private TextView progressMessage;
     @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_beacondata);
         if(getSupportActionBar()!= null) {
             getSupportActionBar().
                     setDisplayOptions(DISPLAY_SHOW_CUSTOM);
             getSupportActionBar().setCustomView(R.layout.topbar_layout);
             TextView actionText = (TextView ) findViewById(R.id.action_text);
             actionText.setText(R.string.app_name);
         }



         progressMessage = findViewById(R.id.message);
         progressMessage.setText(getResources().getString(R.string.connectining_to_beacon));
         /*Intent intent = getIntent();
         if(intent != null) {
             macAddress = intent.getStringExtra("MACADDRESS");
         }*/
        //displayMessage();
        // Timber.v(TAG,"macAddress:" + macAddress);
        //String macAddress1 = "E1:CD:29:EA:AD:20";//"DB:06:E5:17:90:9A";//getMacAddress(); //box1 FF:4D:6F:F8:59:76

        // String macAddress2 = Utility.getMac();
        // boolean result  = macAddress1.equals(macAddress2);

         macAddress = Utility.getMac();
         Log.v(TAG,"mac from utility:" + macAddress);
         //"FF:4D:6F:F8:59:76"
        //registerReceiver(mGattUpdateReceiver, makeGattUpdateIntentFilter());
        Intent gattServiceIntent = new Intent(this, BluetoothLeService.class);
        if(bindService(gattServiceIntent, mServiceConnection, BIND_AUTO_CREATE)) {
            Timber.v("bind service started");
        }
    }

    // Code to manage Service lifecycle.
    private final ServiceConnection mServiceConnection = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName componentName, IBinder service) {
           // executor = Executors.newSingleThreadExecutor();
            Log.v(TAG,"service connection is done");
            mBluetoothLeService = ((BluetoothLeService.LocalBinder) service).getService();
            mBluetoothLeService.setActivityInstance(BeaconDataActivity.this);
            if(macAddress != null) {
                if (!mBluetoothLeService.connect(macAddress)) {
                    Log.v(TAG,"Unable to connect Bluetooth");
                    //finish();
                }
            }
        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            mBluetoothLeService = null;
        }
    };
    private String getMacAddress() {
        Intent intent = getIntent();
        if (intent == null) {
            return null;
        }

        Bundle extras = intent.getExtras();
        if (extras == null) {
            return null;
        }
        return extras.getParcelable(EXTRA_BLUETOOTH_DEVICE_ADDRESS);
    }
 /*   class HandleResponse extends Thread {
        boolean dataRemaining = true;
        @Override
        public void run() {
            super.run();
            do {
                byte[] dataCopy = data;
                if(dataCopy != null && dataCopy.length == 20) {
                    fetchBeaconData(dataCopy);
                    dataCopy = null;
                }
            } while(dataRemaining);
        }
    }*/
    private final BroadcastReceiver mGattUpdateReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            final String action = intent.getAction();
            if (ACTION_GATT_CONNECTED.equals(action)) {
                mConnected = true;
                //updateConnectionState(R.string.connected);
                Timber.v( "ACTION_GATT_CONNECTED");
                invalidateOptionsMenu();
            } else if (ACTION_GATT_DISCONNECTED.equals(action)) {
                mConnected = false;
                Timber.v( "ACTION_GATT_DISCONNECTED");
                launchBarcodeScannerActivity();
                //updateConnectionState(R.string.disconnected);

                //resetBLE("service disconnected");
                //invalidateOptionsMenu();
                //clearUI();
            } else if (ACTION_GATT_SERVICES_DISCOVERED.equals(action)) {
                Timber.v( "ACTION_GATT_SERVICES_DISCOVERED");
                // Show all the supported services and characteristics on the user interface.

                //displayGattServices(mBluetoothLeService.getSupportedGattServices());
            } else if (ACTION_DATA_AVAILABLE.equals(action)) {
                Timber.v( "ACTION_DATA_AVAILABLE");
                //receivedData(intent.getByteArrayExtra(EXTRA_DATA));
                //data = intent.getByteArrayExtra(EXTRA_DATA);
                //displayData(intent.getStringExtra(BluetoothLeService.EXTRA_DATA));
            }
        }
    };
    private static IntentFilter makeGattUpdateIntentFilter() {
        final IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(ACTION_GATT_CONNECTED);
        intentFilter.addAction(ACTION_GATT_DISCONNECTED);
        intentFilter.addAction(ACTION_GATT_SERVICES_DISCOVERED);
        intentFilter.addAction(ACTION_DATA_AVAILABLE);
        return intentFilter;
    }
    private void unRegisterReceivers() {
        try {
           // unregisterReceiver(mGattUpdateReceiver);
            unbindService(mServiceConnection);
            mBluetoothLeService = null;
        } catch (Exception e) {
            Timber.v("unregister exxxxxxx");
        }
    }

    /*private void displayMessage() {
        mSpinner = new ProgressDialog(this);
        mSpinner.setMessage("connecting and getting data from beacon please wait...");
        mSpinner.setCancelable(false);
        mSpinner.isIndeterminate();
        mSpinner.show();
    }
    private void dismissMessage() {
        mSpinner.dismiss();

    }*/
    /*original public void receivedData(String readMessage) {
        boolean stopped = false;
        if (readMessage != null) {
            // response.append(readMessage); //test code
            //final String readMessage = new String(buffer, 0, charsRead);
            Timber.v("response in activity" + readMessage);
            for (int i = 0; i < readMessage.length(); i++) {
                String response = Integer.toHexString(readMessage.charAt(i));
                Timber.v("resp:" + response);

            }
        }else {
            Timber.v("no response" + readMessage);
        }
        }*/

   /* private void receivedData(final byte[] packetData) {
//        ExecutorService executor = Executors.newSingleThreadExecutor();
        executor.execute(new Runnable() {
            @Override
            public void run() {
                fetchBeaconData(packetData);
            }
        });
    }*/

    @Override
    public void updateData(/*byte[] data*/) {
        //mSpinner.dismiss();
       // for(int i = 0 ; i < data.length; i++)
       // txtView.setText(data[i]);
    }

    @Override
    public void callPreviousScreen() {
        /*unbindService(mServiceConnection);
        mSpinner.dismiss();
        finish();*/
    }

    @Override
    public void result(final int numberOfRecords,final int temperatureAlert,
                       final int humidityAlert,final int vibrationAlert,final int shockAlert) {
        new Handler(getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                if(numberOfRecords == 0) {
                    Toast.makeText(BeaconDataActivity.this,getResources().getString(R.string.no_record),Toast.LENGTH_SHORT).show();
                }
                else {
                    setAlertInformation(temperatureAlert, humidityAlert, vibrationAlert, shockAlert);
                }
                launchBarcodeScannerActivity();
            }
        });
    }

    @Override
    public void showMessage(final String message) {
        new Handler(getMainLooper()).post(new Runnable() {
            @Override
            public void run() {
                if(message.equalsIgnoreCase("success")) {
                   // Toast.makeText(BeaconDataActivity.this,message,Toast.LENGTH_SHORT).show();
                }
                else if (message.equalsIgnoreCase("error")) {
                    Toast.makeText(BeaconDataActivity.this,getResources().getString(R.string.beacon_connection_error),Toast.LENGTH_SHORT).show();
                    launchBarcodeScannerActivity();
                }
                else {
                    progressMessage.setText(getResources().getString(R.string.beacon_spinner));
                }
            }
        });
    }

    private final BluetoothGattCallback mGattCallback = new BluetoothGattCallback() {
        @Override
        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
            String intentAction;
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                intentAction = ACTION_GATT_CONNECTED;
                mConnectionState = STATE_CONNECTED;
                //broadcastUpdate(intentAction);
                Log.i(TAG, "Connected to GATT server.");
                // Attempts to discover services after successful connection.
                Log.i(TAG, "Attempting to start service discovery:" +
                        mBluetoothGatt.discoverServices());

            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                intentAction = ACTION_GATT_DISCONNECTED;
                mConnectionState = STATE_DISCONNECTED;
                Log.i(TAG, "Disconnected from GATT server.");
                Toast.makeText(BeaconDataActivity.this,"BLE service is not active", Toast.LENGTH_SHORT).show();
               /* failedtextHandler.post(new Runnable(){
                    public void run() {
                        mSpinner.dismiss();
                        Toast.makeText(GetBeaconData.this,"BLE service is not active", Toast.LENGTH_SHORT).show();
                        finish();
                    }
                });*/
                //broadcastUpdate(intentAction);
            }
        }

        @Override
        public void onServicesDiscovered(BluetoothGatt gatt, int status) {
            if (status == BluetoothGatt.GATT_SUCCESS) {
                //broadcastUpdate(ACTION_GATT_SERVICES_DISCOVERED);
                Toast.makeText(BeaconDataActivity.this,"BLE service is active",Toast.LENGTH_SHORT).show();
                /*failedtextHandler.post(new Runnable(){
                    public void run() {
                        Toast.makeText(GetBeaconData.this,"BLE service is active",Toast.LENGTH_SHORT).show();
                        statusvalue.setText("connected");
                        mSpinner.dismiss();
                        //displayGattServices(getSupportedGattServices());

                    }
                });*/

            } else {
                Log.w(TAG, "onServicesDiscovered received: " + status);
            }
        }
        @Override
        public void onCharacteristicRead(BluetoothGatt gatt,
                                         BluetoothGattCharacteristic characteristic,
                                         int status) {
            Log.i(TAG,"onCharacteristicRead" + characteristic.getValue());
            if (status == BluetoothGatt.GATT_SUCCESS) {
                Log.i(TAG, "onCharacteristicRead GATT_SUCCESS");

            }
        }

        @Override
        public void onCharacteristicChanged(BluetoothGatt gatt,
                                            BluetoothGattCharacteristic characteristic) {
            Log.i(TAG, "onCharacteristicChanged");
            //broadcastUpdate(ACTION_DATA_AVAILABLE, characteristic);
        }
        public void onCharacteristicWrite(BluetoothGatt gatt,
                                          BluetoothGattCharacteristic characteristic, int status) {
            Log.i(TAG,"onCharacteristicWrite called:");
        }
    };

   /* public void sendCommand(View view) {
        //send command to beacon here
        mBluetoothLeService.sendCommand(0);
    }*/

   /* protected void resetBLE(String msg) {
        try {
            if(mSpinner != null && mSpinner.isShowing()) {
                mSpinner.dismiss();
            }
            Toast.makeText(GetBeaconData.this,msg,Toast.LENGTH_SHORT).show();
            unRegisterReceivers();
        } catch(Exception e) {
            Timber.v("reset BLExxx");
        }
        finally {
            finish();
        }
    }*/
 /*  private void fetchBeaconData(byte[] data) {
       Log.i(TAG,"fetchBeaconData");
       float temperature;
       float humidity;
       int vibration;
       int shock;
       if(data[12] > 0) {
           temperature = -Integer.valueOf(data[13] +  "." + data[14]);
       }
       else {
           temperature = Float.valueOf(String.valueOf(data[13]) +  "." + String.valueOf(data[14]));
       }
       humidity = Float.valueOf(String.valueOf(data[15]) +  "." + String.valueOf(data[16]));
       vibration = data[17];
       shock = data[18];

   }*/
   /* public class FetchRecordsTask implements Runnable {

        private String loopTaskName;

        public FetchRecordsTask(String loopTaskName) {
            super();
            this.loopTaskName = loopTaskName;
        }

        @Override
        public void run() {
            System.out.println("Starting "+loopTaskName);
            for (int i = 1; i <= 10; i++) {
                System.out.println("Executing "+loopTaskName+" with "+Thread.currentThread().getName()+"===="+i);
            }
            System.out.println("Ending "+loopTaskName);
        }
    }*/
    private void setAlertInformation(int temperatureAlertFromBeacon,int humidityAlertFromBeacon,
                           int vibrationAlertFromBeacon,int shockAlertFromBeacon) {
        ProductData cloudData = ProductData.getInstance();
        int cloudTemperatureAlert = cloudData.getTemperatureAlerts();
        int cloudHumidityAlert = cloudData.getHumidityAlerts();
        int cloudVibrationAlertCount = cloudData.getTamperAlerts(); // tamper is vibration
        int cloudShockAlertCount = cloudData.getShockAlerts();
        boolean cloudAlertStatus = false;
        cloudAlertStatus = cloudData.getAlertStatus();
        boolean beaconAlertStatus = false;
        if(cloudAlertStatus ||temperatureAlertFromBeacon > 0 || humidityAlertFromBeacon > 0
                || vibrationAlertFromBeacon > 0 || shockAlertFromBeacon > 0) {
            beaconAlertStatus = true;
        }

       cloudData.setTemperatureAlerts(cloudTemperatureAlert + temperatureAlertFromBeacon);
       cloudData.setHumidityAlerts(cloudHumidityAlert + humidityAlertFromBeacon);
       cloudData.setTamperAlerts(cloudVibrationAlertCount + vibrationAlertFromBeacon);
       cloudData.setShockAlerts(cloudShockAlertCount + shockAlertFromBeacon);
       cloudData.setAlertStatus(cloudAlertStatus || beaconAlertStatus );
/*       boolean alertFound;
       if(cloudData.getStatus().equalsIgnoreCase("Alert")) {
           alertFound = true;
       }
       else {
           alertFound = false;
       }

        if(alertFound) {
            error.setVisibility(VISIBLE);
            success.setVisibility(View.GONE);
            product_name_value.setText(cloudData.getPoduct());
            product_type_value.setText(cloudData.getObjectType());
            product_id_value.setText(cloudData.getObjectId());
            if (humidityAlertCount > 0) {
                humidity_count.setTextColor(Color.parseColor("#ff0000"));
            }
            else {
                humidity_count.setTextColor(Color.parseColor("#ffffff"));
            }
            if(vibrationAlertCount > 0) {
                vibration_count.setTextColor(Color.parseColor("#ff0000"));
            }
            else {
                vibration_count.setTextColor(Color.parseColor("#ffffff"));
            }
            if(temperatureAlertCount > 0) {
                //temp_count.setBackgroundResource(R.color.color_red);
                temp_count.setTextColor(Color.parseColor("#ff0000"));
            }
            else {
                temp_count.setTextColor(Color.parseColor("#ffffff"));
            }
            if(shockAlertCount > 0){
                shock_count.setTextColor(Color.parseColor("#ff0000"));
            }
            else {
                shock_count.setTextColor(Color.parseColor("#ffffff"));
            }
            humidity_count.setText(String.valueOf(humidityAlertCount));
            vibration_count.setText(String.valueOf(vibrationAlertCount));
            temp_count.setText(String.valueOf(temperatureAlertCount));
            shock_count.setText(String.valueOf(shockAlertCount));
        }
        else {
            success.setVisibility(VISIBLE);
            error.setVisibility(View.GONE);
            product_name_value.setText(cloudData.getPoduct());
            product_type_value .setText(cloudData.getObjectType());
            product_id_value.setText(cloudData.getObjectId());
            vibration_count.setTextColor(Color.parseColor("#ffffff"));
            humidity_count.setTextColor(Color.parseColor("#ffffff"));
            shock_count.setTextColor(Color.parseColor("#ffffff"));
            temp_count.setTextColor(Color.parseColor("#ffffff"));
            humidity_count.setText("0");
            vibration_count.setText("0");
            temp_count.setText("0");
            shock_count.setText("0");
        }*/

    }

    @Override
    public void onBackPressed() {
        //super.onBackPressed();
        //launchBarcodeScannerActivity();
    }

    private void launchBarcodeScannerActivity() {
        Intent intent = new Intent(this,BarcodeScannerActivity.class);
        intent.putExtra("RELAUNCH",true);
        startActivity(intent);
        unRegisterReceivers();
        finish();
    }
}
