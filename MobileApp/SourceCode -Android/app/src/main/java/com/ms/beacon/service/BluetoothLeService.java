/*
 * Copyright (C) 2013 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ms.beacon.service;

import android.app.Service;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.content.Context;
import android.content.Intent;
import android.os.Binder;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;

import com.ms.beacon.R;
import com.ms.beacon.model.BeaconData_;
import com.ms.beacon.model.ProductData;
import com.ms.beacon.ui.BeaconDataActivity;


import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import timber.log.Timber;

import static android.R.attr.value;
import static com.ms.beacon.utils.Constants.ACTION_DATA_AVAILABLE;
import static com.ms.beacon.utils.Constants.ACTION_GATT_CONNECTED;
import static com.ms.beacon.utils.Constants.ACTION_GATT_DISCONNECTED;


/**
 * Service for managing connection and data communication with a GATT server hosted on a
 * given Bluetooth LE device.
 */
public class BluetoothLeService extends Service {
    private final static String TAG = BluetoothLeService.class.getSimpleName();
    int numberOfRecords;

    private BluetoothManager mBluetoothManager;
    private BluetoothAdapter mBluetoothAdapter;
    public static String mBluetoothDeviceAddress;
    private BluetoothGatt mBluetoothGatt;
    private int mConnectionState = STATE_DISCONNECTED;

    private static final int STATE_DISCONNECTED = 0;
    private static final int STATE_CONNECTING = 1;
    private static final int STATE_CONNECTED = 2;
    ArrayList<BluetoothGattCharacteristic> writeData = new ArrayList<>();
    ArrayList<BluetoothGattCharacteristic> readNotify = new ArrayList<>();
    ArrayList<BluetoothGattCharacteristic>readWriteNotify = new ArrayList<>();
    //ArrayList<BluetoothGattCharacteristic> readWriteNotify = new ArrayList<>();
    Handler testHandler;
    private final String LIST_UUID = "UUID";
    private final String LIST_NAME = "NAME";
    private BeaconDataActivity instance;
    //private boolean isSendCommandStarted;
    private boolean isBTConnected;
    private ArrayList<Byte> dataResponse = new ArrayList<>();
    private boolean isPacketStartFound;
    private boolean isPacketEndFound;
    private boolean isTotalRecordsReceived;
    private int numberOfPacketsReceived;
    private FileOutputStream stream;

    List<BeaconData_> beaconData = new ArrayList<>();
    ExecutorService executor;
    private int temperatureAlert;
    private int humidityAlert;
    private int vibrationAlert;
    private int shockAlert;
    private float temperatureUpperLimit;
    private float temperatureLowerLimit;
    private float humidityUpperLimit;
    private float humidityLowerLimit;
    byte[] tempData = new byte[20];
    List<Byte> bleDataList = new ArrayList<>();

    // Implemented callback methods for GATT events that the app cares about.  For example,
    // connection change and services discovered.

    private final BluetoothGattCallback mGattCallback = new BluetoothGattCallback() {
        @Override
        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
            String intentAction;
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                intentAction = ACTION_GATT_CONNECTED;
                mConnectionState = STATE_CONNECTED;
                isBTConnected = true;
                broadcastUpdate(intentAction);
                //getActivityInstance().showMessage("success");
                Log.i(TAG, "Connected to GATT server.");
                // Attempts to discover services after successful connection.
                Log.i(TAG, "Attempting to start service discovery:" +
                        mBluetoothGatt.discoverServices());


            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                intentAction = ACTION_GATT_DISCONNECTED;
                mConnectionState = STATE_DISCONNECTED;
                Log.i(TAG, "Disconnected from GATT server.");
                isBTConnected = false;
                //if(!isSendCommandStarted)
               // broadcastUpdate(intentAction);
                getActivityInstance().showMessage("error");
                //getActivityInstance().callPreviousScreen();
                //else //try to re connect;
                //connect(instance.getBTDevice().getAddress());
            }
        }

        @Override
        public void onServicesDiscovered(BluetoothGatt gatt, int status) {
            if (status == BluetoothGatt.GATT_SUCCESS) {
                isBTConnected = true;
                Timber.v("onServicesDiscovered called:");
                readGattServices(getSupportedGattServices());
                new Handler(getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        Timber.v( "sending first command");
                        getActivityInstance().showMessage("");
                        getTemperatureHumidityLimitValues();
                        Log.v(TAG, "send command to beacon.");
                        sendCommand(0);
                    }
                },2000);

            } else {
                Timber.v( "onServicesDiscovered received: " + status);
            }
        }


        @Override
        public void onCharacteristicRead(BluetoothGatt gatt,
                                         BluetoothGattCharacteristic characteristic,
                                         int status) {
            Timber.v("onCharacteristicRead" + characteristic.getValue());
            Timber.v("ACTION_DATA_AVAILABLE");
            if (status == BluetoothGatt.GATT_SUCCESS) {
                Intent intent = new Intent(ACTION_DATA_AVAILABLE);
                // For all other profiles, writes the data formatted in HEX.
//                final byte[] data = characteristic.getValue();
//                if (data != null && data.length > 0) {
//                    // this is hex final StringBuilder stringBuilder = new StringBuilder(data.length);
//
//                    String str = new String(data);
//                    //instance.receivedData(str);
//                   /* testHandler.post(new Runnable() {
//                        public void run() {
//                            Toast.makeText(instance,"res:" + stringBuilder.toString(), Toast.LENGTH_SHORT).show();
//
//                        }
//                    });*/
//                    //instance.onUpdateResponse(stringBuilder.toString());
//                    /*for(byte byteChar : data)
//                        stringBuilder.append(String.format("%02X ", byteChar));*/
//
//                    // this is hex intent.putExtra(EXTRA_DATA, /*new String(data) + "\n" + */stringBuilder.toString());
//
//                    //intent.putExtra(EXTRA_DATA, str);
//                }


                broadcastUpdate(ACTION_DATA_AVAILABLE, characteristic);
            }
        }

        @Override
        public void onCharacteristicChanged(BluetoothGatt gatt,
                                            BluetoothGattCharacteristic characteristic) {
            Timber.v("onCharacteristicChanged");
            broadcastUpdate(ACTION_DATA_AVAILABLE, characteristic);
        }
        public void onCharacteristicWrite(BluetoothGatt gatt,
                                          BluetoothGattCharacteristic characteristic, int status) {
            Timber.v("onCharacteristicWrite called:");
        }
    };

    private void broadcastUpdate(final String action) {
        final Intent intent = new Intent(action);
        sendBroadcast(intent);
    }

    private void broadcastUpdate(final String action,
                                 final BluetoothGattCharacteristic characteristic) {
        final Intent intent = new Intent(action);
        final byte[] data = characteristic.getValue(); //original code
        if(data != null) {
            /*for(int i = 0; i< data.length; i++) {
                Log.v(TAG,":" + data[i]);
            }*/
            Log.v(TAG,"data length:" + data.length);
           // test code  if (data.length == 20) {

            if(data.length <= 20) {

                if(data.length >= 4 && data[3] == 0) {
                    // this is last record // since response bytes are 0
                    for(int i = 0; i< data.length; i++) {
                        Log.v(TAG,"last:" + data[i]);
                    }
                    Log.v(TAG,"write data in file done total length:" + bleDataList.size());
                    //Log.v(TAG,"total length:" + bleData.size());
                    parsePacket(bleDataList);

                }
                else {
                   // Log.v(TAG,"data lenght:" + data.length);
                    numberOfRecords++;
                    addPacket(data);
                    new Handler(getMainLooper()).postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            Log.v(TAG, "send data to beacon again");
                            sendCommand(numberOfRecords);
                        }
                    }, 20);
                }
            }

        /*
            if(data.length == 20) {
                numberOfRecords++;
                addPacket(data);
                new Handler(getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        Log.v(TAG, "send data to beacon again");
                        sendCommand(numberOfRecords);
                    }
                }, 20);
            }
            else {
                if(data.length >= 4) {
                    for(int i = 0; i< data.length; i++) {
                        Log.v(TAG,"last:" + data[i]);
                    }
                    if(data[3] == 0) {
                        // this is last record // since response bytes are 0
                        Log.v(TAG,"write data in file done");
                        Log.v(TAG,"total length:" + bleData.size());
                        getActivityInstance().result(numberOfRecords, temperatureAlert, humidityAlert, vibrationAlert, shockAlert);

                    }
                    else {
                        Log.v(TAG,"data less than 20 addind:" + data.length);
                        addPacket(data);
                    }
                }
            }*/
           // test code }
            /* test code else {
                Log.v(TAG,"else case");
                for(int i = 0; i< data.length; i++) {
                Log.v(TAG,":" + data[i]);
            }
                addPacket(data);
            }*/
        }
        else {
            Log.v(TAG,"write data in file done data null case");
            parsePacket(bleDataList);
            getActivityInstance().result(numberOfRecords, temperatureAlert, humidityAlert, vibrationAlert, shockAlert);
            Log.v(TAG,"total length:" + bleDataList.size());
        }



        /*if(data.length == 20) {
            numberOfRecords++;
            Timber.v("numberOfRecords:" +numberOfRecords);
            if(data[19] == 0) {
                //done
                Timber.v("write data in file done");
                getActivityInstance().result(numberOfRecords);

            }
            else {
                writeData(numberOfRecords);
            }
        }*/

        //considering that each packet will be of 20 bytes.
      //  Timber.v("numberOfPacketsReceived : " + numberOfPacketsReceived);
        //writeToFile(data,getApplicationContext());
       /* if(data.length <= 20) {
           for(byte x : data)
            dataResponse.add(x);
            numberOfPacketsReceived ++;
        }
        if(numberOfPacketsReceived == 1000) {
            //received 1000 packets, send it for parsing.
            intent.putExtra(EXTRA_DATA, dataResponse);
            sendBroadcast(intent);
            Timber.v("write data in file done");
            closeStream();
        }*/

      /*  for(int i = 0; i < data.length; i++) {
            if(!isPacketStartFound) {
                int firstDataHeader = Byte.compare(data[i],(byte)85);
                if(firstDataHeader == 0) {
                    if(i+1 < data.length) {
                        int secondDataHeader = Byte.compare(data[i+1],(byte)(-85));
                        if(secondDataHeader == 0) {
                            if(i + 2 < data.length) {
                                int typeByte = Byte.compare(data[i+1],(byte)05);
                                if(typeByte == 0) {
                                    isPacketStartFound = true;
                                }
                            }
                        }
                    }

                }
            }
        }*/
       // if (data != null && data.length > 0) {
            /*float temperature;
            float humidity;
            int vibration;
            int shock;
            if(data[12] > 0) {
                temperature = -Integer.valueOf(data[13] +  "." + data[14]);
            }
            else {
                temperature = Float.valueOf(String.valueOf(data[13]) +  "." + String.valueOf(data[14]));
            }
            if(temperature > 20) {
                temperatureAlert++;
            }
            humidity = Float.valueOf(String.valueOf(data[15]) +  "." + String.valueOf(data[16]));
            if(humidity > 10) {
                humidityAlert++;
            }
            vibration = data[17];
            shock = data[18];*/



            //numberOfRecords++;
               // String str = null;
                //Timber.v("get packet data :" + data.length);
                /*try {
                    str = new String(data,"UTF-8");
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }*/

               /*for(int i = 0; i< data.length; i++) {
                    Log.v(TAG,":" + data[i]);
                }*/
                //Log.i(TAG,"resp str:" + str);
                //int totalNumberOfPackets = Integer.valueOf(str.charAt(0+3));
                //Log.i(TAG,"totalNumberOfPackets:" + totalNumberOfPackets);

                //final StringBuilder stringBuilder = new StringBuilder(data.length);
                /*testHandler.post(new Runnable() {
                    public void run() {
                        Toast.makeText(instance,"res:" + stringBuilder.toString(), Toast.LENGTH_SHORT).show();

                    }
                });*/
                //instance.onUpdateResponse(stringBuilder.toString());
//                for(byte byteChar : data)
//                    stringBuilder.append(String.format("%02X ", byteChar));
               // intent.putExtra(EXTRA_DATA, str/*new String(data) + "\n" + stringBuilder.toString()*/);
                //intent.putExtra(EXTRA_DATA, data);

          //  }
       // }
        //sendBroadcast(intent);
       /* if(data != null*//*&& data.length == 20*//*) {
            Timber.v("get packet data :" + data.length);
                numberOfRecords++;
                parsePacket(data);

                Timber.v("receivedRecords count:" + numberOfRecords);
                if (data.length == 20 && data[19] == 0) {
                    //done
                    Timber.v("write data in file done");
                    getActivityInstance().result(numberOfRecords, temperatureAlert, humidityAlert, vibrationAlert, shockAlert);
                    //getActivityInstance().showMessage("got complete data");
                } else {
                    new Handler(getMainLooper()).postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            Timber.v("send data to beacon again");
                            sendCommand(numberOfRecords);
                        }
                    }, 20);

                }

        }
        else {
            Timber.v("write data in file done");
            getActivityInstance().result(numberOfRecords,temperatureAlert,humidityAlert,vibrationAlert,shockAlert);
            Timber.v("receivedNumberOfRecords:" +numberOfRecords);
            Timber.v("temp alerts:" +temperatureAlert + "humidity alerts:" + humidityAlert
                    + "vibration alert:" + vibrationAlert + "temper alerts:" + shockAlert);
        }*/
    }

    public class LocalBinder extends Binder {
        public BluetoothLeService getService() {
            beaconData.clear();
            executor = Executors.newSingleThreadExecutor();
            return BluetoothLeService.this;
        }
    }

    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

    @Override
    public boolean onUnbind(Intent intent) {
        // After using a given device, you should make sure that BluetoothGatt.close() is called
        // such that resources are cleaned up properly.  In this particular example, close() is
        // invoked when the UI is disconnected from the Service.
        close();
        return super.onUnbind(intent);
    }

    private final IBinder mBinder = new LocalBinder();
    /**
     * Connects to the GATT server hosted on the Bluetooth LE device.
     *
     * @param address The device address of the destination device.
     *
     * @return Return true if the connection is initiated successfully. The connection result
     *         is reported asynchronously through the
     *         {@code BluetoothGattCallback#onConnectionStateChange(android.bluetooth.BluetoothGatt, int, int)}
     *         callback.
     */

    public boolean connect(final String address) {
        if (mBluetoothManager == null) {
            mBluetoothManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
            if (mBluetoothManager == null) {
                Log.e(TAG, "Unable to initialize BluetoothManager.");
                return false;
            }
        }

        mBluetoothAdapter = mBluetoothManager.getAdapter();
        if (mBluetoothAdapter == null) {
            Log.e(TAG, "Unable to obtain a BluetoothAdapter.");
            return false;
        }
//        if (mBluetoothAdapter == null || address == null) {
//            Log.w(TAG, "BluetoothAdapter not initialized or unspecified address.");
//            return false;
//        }

        // Previously connected device.  Try to reconnect.
        if (mBluetoothDeviceAddress != null && address.equals(mBluetoothDeviceAddress)
                && mBluetoothGatt != null) {
            //Log.i(TAG, "Trying to use an existing mBluetoothGatt for connection.");
            if (mBluetoothGatt.connect()) {
                mConnectionState = STATE_CONNECTING;
                return true;
            } else {
                return false;
            }
        }

        final BluetoothDevice device = mBluetoothAdapter.getRemoteDevice(address);
        if (device == null) {
            Log.e(TAG, "Device not found.  Unable to connect.");
            return false;
        }
        // We want to directly connect to the device, so we are setting the autoConnect
        // parameter to false.
        mBluetoothGatt = device.connectGatt(this, false, mGattCallback,BluetoothDevice.TRANSPORT_AUTO);
        Timber.v("Trying to create a new connection.");
        mBluetoothDeviceAddress = address;
        mConnectionState = STATE_CONNECTING;
        return true;
    }

    /**
     * Disconnects an existing connection or cancel a pending connection. The disconnection result
     * is reported asynchronously through the
     * {@code BluetoothGattCallback#onConnectionStateChange(android.bluetooth.BluetoothGatt, int, int)}
     * callback.
     */
    public void disconnect() {
        if (mBluetoothAdapter == null || mBluetoothGatt == null) {
            Log.i(TAG, "BluetoothAdapter not initialized");
            return;
        }
        mBluetoothGatt.disconnect();
    }

    /**
     * After using a given BLE device, the app must call this method to ensure resources are
     * released properly.
     */
    public void close() {
        if (mBluetoothGatt == null) {
            return;
        }
        mBluetoothGatt.close();
        mBluetoothGatt = null;
    }

    /**
     * Request a read on a given {@code BluetoothGattCharacteristic}. The read result is reported
     * asynchronously through the {@code BluetoothGattCallback#onCharacteristicRead(android.bluetooth.BluetoothGatt, android.bluetooth.BluetoothGattCharacteristic, int)}
     * callback.
     *
     * @param characteristic The characteristic to read from.
     */
    public void readCharacteristic(BluetoothGattCharacteristic characteristic) {
        if (mBluetoothAdapter == null || mBluetoothGatt == null) {
            Log.w(TAG, "BluetoothAdapter not initialized");
            return;
        }
        mBluetoothGatt.readCharacteristic(characteristic);
    }

    /**
     * Enables or disables notification on a give characteristic.
     *
     * @param characteristic Characteristic to act on.
     * @param enabled If true, enable notification.  False otherwise.
     */
/*    public void setCharacteristicNotification(BluetoothGattCharacteristic characteristic,
                                              boolean enabled) {
        if (mBluetoothAdapter == null || mBluetoothGatt == null) {
            Log.w(TAG, "BluetoothAdapter not initialized");
            return;
        }
        mBluetoothGatt.setCharacteristicNotification(characteristic, enabled);

        // This is specific to Heart Rate Measurement.
        if (UUID_HEART_RATE_MEASUREMENT.equals(characteristic.getUuid())) {
            BluetoothGattDescriptor descriptor = characteristic.getDescriptor(
                    UUID.fromString(SampleGattAttributes.CLIENT_CHARACTERISTIC_CONFIG));
            descriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
            mBluetoothGatt.writeDescriptor(descriptor);
        }
    }*/

    /**
     * Retrieves a list of supported GATT services on the connected device. This should be
     * invoked only after {@code BluetoothGatt#discoverServices()} completes successfully.
     *
     * @return A {@code List} of supported services.
     */
    public List<BluetoothGattService> getSupportedGattServices() {
        if (mBluetoothGatt == null) return null;

        return mBluetoothGatt.getServices();
    }
    public void sendData() {

        if (mBluetoothAdapter == null || mBluetoothGatt == null) {
            Log.w(TAG, "BluetoothAdapter not initialized");
            return;
        }
        /*check if the service is available on the device*/
        BluetoothGattService mCustomService = mBluetoothGatt.getService(UUID.fromString("00000000-0000-1000-8000-00805f9b34fb"));
        if(mCustomService == null){
            Log.w(TAG, "Custom BLE Service not found");
            return;
        }
        /*get the read characteristic from the service*/

        BluetoothGattCharacteristic mWriteCharacteristic = mCustomService.getCharacteristic(UUID.fromString("00000000-0000-1000-8000-00805f9b34fb"));
        // test it also mWriteCharacteristic.setWriteType(BluetoothGattCharacteristic.WRITE_TYPE_NO_RESPONSE);
        mWriteCharacteristic.setValue(value, BluetoothGattCharacteristic.FORMAT_UINT8,0);
        if(mBluetoothGatt.writeCharacteristic(mWriteCharacteristic) == false){
            Log.w(TAG, "Failed to write characteristic");
        }
    }

    public byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                    + Character.digit(s.charAt(i + 1), 16));
        }
        return data;
    }
  /*  public void sendCommand(String cmd) {
        String originalString = cmd;

        //byte[] b = hexStringToByteArray(originalString);
        List<BluetoothGattService> list = getSupportedGattServices();
        byte[] b = {36, 112, 114, 111, 103, 109, 107, 114, 115, 44, 54, 44, 49, 44, 48, 44, 52, 48, 44, 0, 0, 1, 65, 112, 112, 31, 113, 119, 101, 114, 116, 121, 30, 65, 114, 101, 97, 31, 30, 66, 101, 110, 100, 31, 49, 50, 51, 30, 67, 111, 97, 116, 105, 110, 103, 31, 30, 58, 28, 44, 13, 10};

            BluetoothGattCharacteristic characteristic =  list.getmBluetoothGatt.getServices().get(0).getCharacteristics(characteristic.getUuid());
            characteristic.setValue(b); // call this BEFORE(!) you 'write' any stuff to the server
            mBluetoothGatt.writeCharacteristic(characteristic);
            Log.i(TAG, "command sent: characteristic=" + characteristic.getUuid());
    }*/
    public interface updateResponse{
        public void onUpdateResponse();
        public void testFunction();
        public void testFunctionRFID();
        public void updateUI();
    }
    public void setActivityInstance(BeaconDataActivity instance) {
        this.instance = instance;
        testHandler = new Handler(instance.getMainLooper());
    }
    public BeaconDataActivity getActivityInstance() {
        return instance;
    }
    private void readGattServices(List<BluetoothGattService> gattServices) {
        if (gattServices == null) return;
        String uuid;
        Log.i(TAG, "displayGattServices");

        if(gattServices.size() == 0) {
            Timber.v("no service found");
            return;
        }
        for (BluetoothGattService gattService : gattServices) {
            HashMap<String, String> currentServiceData = new HashMap<String, String>(); // store service uuid
            uuid = gattService.getUuid().toString();
            Log.i(TAG,"service type:" + gattService.getType());
            Log.i(TAG,"service uuid:"+ uuid);
            currentServiceData.put(LIST_NAME, uuid);
            currentServiceData.put(LIST_UUID, uuid);

            List<BluetoothGattCharacteristic> gattCharacteristics = gattService.getCharacteristics();

         //   if(uuid.equalsIgnoreCase("B410")) { //service Id
                for (BluetoothGattCharacteristic gattCharacteristic : gattCharacteristics) {
                    Log.i(TAG, "uuid Characteristic :" + gattCharacteristic.getUuid().toString());
                    Log.i(TAG, "value:" + gattCharacteristic.getValue());
                    Log.i(TAG, "Desc:" + gattCharacteristic.getDescriptors());
                    Log.i(TAG, "perm:" + gattCharacteristic.getPermissions());
                    Log.i(TAG, "property:" + gattCharacteristic.getProperties());
                    Log.i(TAG, "write type:" + gattCharacteristic.getWriteType());

                    if(gattCharacteristic.getProperties() == 16) { // PROPERTY_WRITE
                        //writeData.add(gattCharacteristic);
                        //writeData.add(gattCharacteristic); //new line
                        mBluetoothGatt.setCharacteristicNotification(gattCharacteristic,true);
                        BluetoothGattDescriptor descriptor = gattCharacteristic.getDescriptors().get(0);
                        descriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
                        mBluetoothGatt.writeDescriptor(descriptor);
                    }
                    else if(gattCharacteristic.getProperties() == 12) {
                        writeData.add(gattCharacteristic); // original code
                        //readNotify.add(gattCharacteristic);
                        mBluetoothGatt.setCharacteristicNotification(gattCharacteristic,true);
                       // BluetoothGattDescriptor descriptor = gattCharacteristic.getDescriptors().get(0);
                       // descriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
                       // mBluetoothGatt.writeDescriptor(descriptor);
                        //mBluetoothGatt.readCharacteristic(gattCharacteristic);
                    }
                    else if(gattCharacteristic.getProperties() == 24) {
                        readWriteNotify.add(gattCharacteristic);
                        mBluetoothGatt.setCharacteristicNotification(gattCharacteristic,true);
                    }


                    /*if(gattCharacteristic.getUuid().toString().equalsIgnoreCase("0xB411")) {
                        Timber.v("*******0xB411 property found**********");
                        readNotify.add(gattCharacteristic);
                        mBluetoothGatt.setCharacteristicNotification(gattCharacteristic, true);
                        BluetoothGattDescriptor descriptor = gattCharacteristic.getDescriptors().get(0);
                        descriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
                        mBluetoothGatt.writeDescriptor(descriptor);
                    }
                    else {
                        Timber.v("*******0xB411 property not found**********");
                    }*/
                }
            //}
        }
        /*if(writeData.size() > 0) {
            getActivityInstance().showMessage("service discovered");
        }
        else {
            getActivityInstance().showMessage("no service discovered");
        }*/
       // getActivityInstance().updateData(/*byte[] data*/);
    }

    private void closeStream() {
        try {
            stream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    public interface ServiceResponseCallBack {
        void updateData(/*byte[] data*/);
        void callPreviousScreen();
        void result(int numberOfRecords,int temperatureAlert,int humidityAlert,int vibrationAlert,int shockAlert);
        void showMessage(String message);
    }
    public void sendCommand(int index) {
        Timber.v(TAG, "index:" + index);
        if(index <= 255) {
            byte[] temp = {85, -86, 18, 2, 0, (byte) index};
            BluetoothGattCharacteristic chars = writeData.get(0);



            mBluetoothGatt.setCharacteristicNotification(chars, true);
            chars.setValue(temp);
            chars.setWriteType(BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT);
            mBluetoothGatt.writeCharacteristic(chars);
        }
        else if(index >= 256 && index <= 511) {
            index = index - 256;
            byte[] temp = {85, -86, 18, 2, 1, (byte) index};
            BluetoothGattCharacteristic chars = writeData.get(0);

            mBluetoothGatt.setCharacteristicNotification(chars, true);
            chars.setValue(temp);
            chars.setWriteType(BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT);
            mBluetoothGatt.writeCharacteristic(chars);
        }
        else if(index >= 512 && index <= 767) {
            index = index - 512;
            byte[] temp = {85, -86, 18, 2, 2, (byte) index};
            BluetoothGattCharacteristic chars = writeData.get(0);

            mBluetoothGatt.setCharacteristicNotification(chars, true);
            chars.setValue(temp);
            chars.setWriteType(BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT);
            mBluetoothGatt.writeCharacteristic(chars);
        }
        else {
            index = index - 768;
            byte[] temp = {85, -86, 18, 2, 3, (byte) index};
            BluetoothGattCharacteristic chars = writeData.get(0);

            mBluetoothGatt.setCharacteristicNotification(chars, true);
            chars.setValue(temp);
            chars.setWriteType(BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT);
            mBluetoothGatt.writeCharacteristic(chars);
        }

    }
    private void fetchAlertInfo(List<Byte> bleList) {
        Log.v(TAG,"fetchAlertInfo started:");
        float temperature;
        float humidity;
        int vibration;
        int shock;
        for(int i = 0; i < bleList.size();) {
            Log.v(TAG,"index:" + i);
            if(bleList.get(i+12) > 0) {
                temperature = -Float.valueOf(String.valueOf(bleList.get(i+13)) +  "." + String.valueOf(bleList.get(i+14)));
            }
            else {
                temperature = Float.valueOf(String.valueOf(bleList.get(i+13)) +  "." + String.valueOf(bleList.get(i+14)));
            }
            calculateTemperatureAlert(temperature);
            humidity = Float.valueOf(String.valueOf(bleList.get(i+15)) +  "." + String.valueOf(bleList.get(i+16)));
            calculateHumidityAlert(humidity);
            vibration = bleList.get(i+17);
            if(vibration == 1) {
                vibrationAlert++;
            }
            shock = bleList.get(i+18);
            if(shock == 1) {
                shockAlert++;
            }
            i += 20;
            Log.v(TAG," while parsing : " + "temperatureAlert:" + temperatureAlert +
                    "humidityAlert:" + humidityAlert + "shockAlert:"
                    + shockAlert + "vibrationAlert:" + vibrationAlert);
        }
        Log.v(TAG,"parsing done : temperatureAlert:" + temperatureAlert +
                "humidityAlert:" + humidityAlert + "shockAlert:"
                + shockAlert + "vibrationAlert:" + vibrationAlert);
        Log.v(TAG,"fetchAlertInfo done:");
        getActivityInstance().result(numberOfRecords, temperatureAlert, humidityAlert, vibrationAlert, shockAlert);
        /*if(data[12] > 0) {
            temperature = -Integer.valueOf(data[13] +  "." + data[14]);
        }
        else {
            temperature = Float.valueOf(String.valueOf(data[13]) +  "." + String.valueOf(data[14]));
        }*/


      /*  if(temperature > 20) {
            //read it
            temperatureAlert++;
        }*/
        //humidity = Float.valueOf(String.valueOf(data[15]) +  "." + String.valueOf(data[16]));
        //calculateHumidityAlert(humidity);
       /* if(humidity > 10) {
            humidityAlert++;
        }*/
//        vibration = data[17];
//        if(vibration == 1) {
//            vibrationAlert++;
//        }
//        shock = data[18];
//        if(shock == 1) {
//            shockAlert++;
//        }
//        Log.v(TAG,"temperatureAlert:" + temperatureAlert +
//                "humidityAlert:" + humidityAlert + "shockAlert:"
//                + shockAlert + "vibrationAlert:" + vibrationAlert);


    }

    private void fetchBeaconDetai1(byte[] data) {
        Log.v(TAG,"fetchBeaconData:");
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
        calculateTemperatureAlert(temperature);

      /*  if(temperature > 20) {
            //read it
            temperatureAlert++;
        }*/
        humidity = Float.valueOf(String.valueOf(data[15]) +  "." + String.valueOf(data[16]));
        calculateHumidityAlert(humidity);
       /* if(humidity > 10) {
            humidityAlert++;
        }*/
        vibration = data[17];
        if(vibration == 1) {
            vibrationAlert++;
        }
        shock = data[18];
        if(shock == 1) {
            shockAlert++;
        }
        Log.v(TAG,"temperatureAlert:" + temperatureAlert +
                "humidityAlert:" + humidityAlert + "shockAlert:"
                + shockAlert + "vibrationAlert:" + vibrationAlert);


    }

    private void addPacket(final byte[] packetData) {
//        ExecutorService executor = Executors.newSingleThreadExecutor();
        Timber.i(TAG,"receivedData called");
        executor.execute(new Runnable() {
            @Override
            public void run() {
                for(int i = 0; i < packetData.length; i++) {
                    bleDataList.add(packetData[i]);
                }
            }
        });
    }
    private void parsePacket(final List<Byte> packetData) {
//        ExecutorService executor = Executors.newSingleThreadExecutor();
        Timber.i(TAG,"receivedData called");
        executor.execute(new Runnable() {
            @Override
            public void run() {
                    fetchAlertInfo(packetData);
            }
        });
    }
    private void parsePacket1(final byte[] packetData) {
//        ExecutorService executor = Executors.newSingleThreadExecutor();
        Timber.i(TAG,"receivedData called");
        executor.execute(new Runnable() {
            @Override
            public void run() {
                if(packetData.length == 20)
                    fetchBeaconDetai1(packetData);
            }
        });
    }
    private void getTemperatureHumidityLimitValues() {
        ProductData data = ProductData.getInstance();
        temperatureLowerLimit = data.getTemperatureLowerLimit();
        temperatureUpperLimit = data.getTemperatureUpperLimit();
        humidityLowerLimit = data.getHumidityLowerLimit();
        humidityUpperLimit = data.getHumidityUpperLimit();
    }
    private void calculateTemperatureAlert(float temp) {
        int compareLower = Float.compare(temp,temperatureLowerLimit);
        if(compareLower > 0 ) {
            int compareUpper = Float.compare(temp,temperatureUpperLimit);
            if(compareUpper < 0 || compareUpper == 0) {
                //there is no alert
            }
            else {
                temperatureAlert++;
                Timber.v(TAG,"temperatureAlert:" + temperatureAlert);
            }
        }
        else if (compareLower == 0){
            //there is no alert
        }
        else {
            temperatureAlert++;
            Timber.v(TAG,"temperatureAlert1:" + temperatureAlert);
        }
    }
    private void calculateHumidityAlert(float humidity) {
        int compareLower = Float.compare(humidity,humidityLowerLimit);
        if(compareLower > 0 ) {
            int compareUpper = Float.compare(humidity,humidityUpperLimit);
            if(compareUpper < 0 || compareUpper == 0) {
                //there is no alert
            }
            else {
                humidityAlert++;
                Timber.v(TAG,"humidityAlert:" + humidityAlert);
            }
        }
        else if (compareLower == 0){
            //there is no alert
        }
        else {
            humidityAlert++;
            Timber.v(TAG,"humidityAlert1:" + humidityAlert);
        }
    }
}
