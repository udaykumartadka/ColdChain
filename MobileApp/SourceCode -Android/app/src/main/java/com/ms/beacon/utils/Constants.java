package com.ms.beacon.utils;

import android.Manifest;

import static android.Manifest.permission.READ_EXTERNAL_STORAGE;
import static android.Manifest.permission.WRITE_EXTERNAL_STORAGE;

public class Constants {

  public static final String SCAN_RESULT = "SCAN_RESULT";
  public static final long SCAN_PERIOD = 3000;
  public static final String APP_URL_ENCODED = "application/x-www-form-urlencoded";
  public static final String CONTENT_TYPE = "content-type";
  public static final String EXTRA_BLUETOOTH_DEVICE_ADDRESS = "BLE_DEVICE_MAC_ADDRESS";
  public final static String ACTION_GATT_CONNECTED =
          "com.ms.beacon.bluetooth.le.ACTION_GATT_CONNECTED";
  public final static String ACTION_GATT_DISCONNECTED =
          "com.ms.beacon.bluetooth.le.ACTION_GATT_DISCONNECTED";
  public final static String ACTION_GATT_SERVICES_DISCOVERED =
          "com.ms.beacon.bluetooth.le.ACTION_GATT_SERVICES_DISCOVERED";
  public final static String ACTION_DATA_AVAILABLE =
          "com.ms.beacon.bluetooth.le.ACTION_DATA_AVAILABLE";
  public final static String EXTRA_DATA =
          "com.ms.beacon.bluetooth.le.EXTRA_DATA";
  public static final int PACKET_SIZE = 20;
  public static final String[] PERMISSION = new String[]{Manifest.permission.CAMERA,Manifest.permission.INTERNET,
          android.Manifest.permission.ACCESS_FINE_LOCATION, android.Manifest.permission.BLUETOOTH_ADMIN,
          android.Manifest.permission.BLUETOOTH,android.Manifest.permission.ACCESS_NETWORK_STATE,READ_EXTERNAL_STORAGE,WRITE_EXTERNAL_STORAGE};

}
