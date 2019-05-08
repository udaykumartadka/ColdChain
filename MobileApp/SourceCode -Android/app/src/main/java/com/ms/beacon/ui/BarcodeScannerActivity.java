package com.ms.beacon.ui;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Handler;
import android.support.annotation.RequiresApi;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.dx.dxloadingbutton.lib.LoadingButton;
import com.google.zxing.client.android.CaptureActivity;
import com.ms.beacon.R;
import com.ms.beacon.model.APIService;
import com.ms.beacon.model.ProductData;
import com.ms.beacon.model.ProductStandardData;
import com.ms.beacon.service.RetrofitClient;
import com.ms.beacon.utils.Constants;
import com.ms.beacon.utils.Utility;
import com.ms.beacon.utils.WebServiceURL;


import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import timber.log.Timber;

import static android.support.v7.app.ActionBar.*;
import static android.view.View.VISIBLE;
import static com.ms.beacon.utils.Constants.EXTRA_BLUETOOTH_DEVICE_ADDRESS;



public class BarcodeScannerActivity extends AppCompatActivity/* implements ProductDataRestCall.MainActivityCallBack*//*, BeaconConsumer,
        MonitorNotifier,RangeNotifier, BootstrapNotifier*/ {
    public static final String TAG = BarcodeScannerActivity.class.getSimpleName();
    private EditText barcode;
    private Button edit_barcode_btn;
    private Button submit_btn;
    private Button scan_sensor;
    private TextView beacon_name;
    private TextView beacon_value;
    Button scan_barcode_btn;
    //private BeaconManager mBeaconManager;
   // private BackgroundPowerSaver backgroundPowerSaver;
    private FileOutputStream stream;
    private Handler resultHandler;

    //for dialog
    private LayoutInflater factory;
    private View dialogView = null;
    private TextView displayMessage;
    private AlertDialog builder;
    RelativeLayout header;
    RelativeLayout status_icon;
    RelativeLayout product_data;
    RelativeLayout buttonlayout;
    TextView tempMessage;
    ImageView icon_view;
    LoadingButton lb;
    Button btn_ok;
    View top_line;
    //View line;

    //new code
    private View bottom_line;
    private ImageView launch_scan;
    private ImageView error;
    private ImageView success;

    private TextView product_name_value;
    private TextView product_type_value;
    private TextView product_id_value;
    private TextView humidity_count;
    private TextView vibration_count;
    private TextView shock_count;
    private TextView temperature_count;
    private Boolean exit = false;
    private boolean invalidBarcode;
    private Button getbeaconrecord;


    public BarcodeScannerActivity() {
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_barcodescanner);
        Intent intent = getIntent();
        boolean isActivityRelaunched = false;
        if(intent != null) {
            isActivityRelaunched = intent.getBooleanExtra("RELAUNCH", false);
        }
        findViewIds();
        if(isActivityRelaunched) {
            showViews();
        }
        //hideViews();
        Timber.v(TAG,"oncreate");
        launch_scan.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                invalidBarcode = false;
                scanBarcode();
            }
        });
        /*if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getPermission();
        }*/

        /*final LoadingButton lb = (LoadingButton)findViewById(R.id.loading_btn);
        lb.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                lb.startLoading(); //start loading
            }
        });*/

        /*scan_barcode_btn = findViewById(R.id.scan_barcode_btn);
        scan_barcode_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                lb.loadingSuccessful();
            }
        });*/

        //barcode =  findViewById(R.id.barcode_value);


        //beacon_name.setVisibility(View.INVISIBLE);
       // beacon_value.setVisibility(View.INVISIBLE);
        //barcode.setEnabled(false);
        //scan_sensor.setVisibility(View.GONE);
        if(getSupportActionBar()!= null) {
            getSupportActionBar().
                    setDisplayOptions(DISPLAY_SHOW_CUSTOM);
            getSupportActionBar().setCustomView(R.layout.topbar_layout);
            TextView actionText = (TextView ) findViewById(R.id.action_text);
            actionText.setText(R.string.app_name);
        }
        if(!isActivityRelaunched) {
            scanBarcode();
        }
        else {
            setValues();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        Timber.v("onresume");
       /* mBeaconManager = BeaconManager.getInstanceForApplication(this.getApplicationContext());
        // Detect the main Eddystone-UID frame:
        mBeaconManager.getBeaconParsers().add(new BeaconParser().
                setBeaconLayout(BeaconParser.EDDYSTONE_UID_LAYOUT));
        mBeaconManager.bind(this);*/

    }

   /* @Override
    protected void onPause() {
        super.onPause();
        try {
            mBeaconManager.unbind(this);
        } catch (Exception e) {
            Timber.e("beacon unregister");
        }
    }*/


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(requestCode == 0){
            try {
                if (resultCode == RESULT_OK) {
                    String result = data.getStringExtra(Constants.SCAN_RESULT);
                    Log.i(TAG,"scan barcode :" + result);
                    if(result != null) {
                        invalidBarcode = false;
                        //barcode.setVisibility(VISIBLE);
                        //barcode.setText("p1");
                        Timber.i("barcode api hit started");
                       /* int[] data1 = {10,12,14,16,18,20,10,12,14,16,18,20,10,12,14,16,18,20
                        ,10,12,14,16,18,20,10,12,14,16,18,20
                        ,10,12,14,16,18,20,10,12,14,16,18,20
                        ,10,12,14,16,18,20,
                                10,12,14,16,18,20};
                        writeToFile(data1,getApplicationContext());
                        closeStream();*/
                        //Utility.showDialog("turn on bluetooth", BarcodeScannerActivity.this,);
                        showResultDialog(this.getResources().getString(R.string.barcode_spinner),this);
                        APIService apiInterface = RetrofitClient.getClient().create(APIService.class);
                        String url = WebServiceURL.BASE_URL + WebServiceURL.PRODUCT_INFO+result;
                        Call<ProductData> cloudAPIData = apiInterface.getAlerts(url);
                        cloudAPIData.enqueue(new Callback<ProductData>() {
                            @Override
                            public void onResponse(Call<ProductData> call, Response<ProductData> response) {
                                Timber.v("data success");
                                final ProductData data = response.body();
                                getCloudDataFromResponse(data);
                                if(data != null) {
                                    //parseData(data);
                                   // Utility.displayToast(BarcodeScannerActivity.this,"cloud api data is found");
                                    new Handler(getMainLooper()).postDelayed(new Runnable() {
                                        @Override
                                        public void run() {
                                            showViews();
                                            setValues();
                                            builder.dismiss();
                                            //launchBeaconDataActivity();
                                        }
                                    },2000);

                                }
                                else {
                                    new Handler(getMainLooper()).postDelayed(new Runnable() {
                                        @Override
                                        public void run() {
                                            invalidBarcode = true;
                                            showViews();
                                            Utility.displayToast(BarcodeScannerActivity.this,getResources().getString(R.string.invalid_barcode));
                                            builder.dismiss();
                                        }
                                    },2000);
                                }
                            }

                            @Override
                            public void onFailure(Call<ProductData> call, Throwable t) {
                                Timber.v("data fail");

                            }
                        });
                       //new ProductDataRestCall(this,result,this).execute().get(20000, TimeUnit.MILLISECONDS);
                        //edit_barcode_btn.setVisibility(VISIBLE);
                        //submit_btn.setVisibility(VISIBLE);
                        //scan_sensor.setVisibility(View.INVISIBLE);
                    }

                } else if (resultCode == RESULT_CANCELED) {
                    //barcode.setVisibility(View.INVISIBLE);
                    //edit_barcode_btn.setVisibility(View.INVISIBLE);
                    //submit_btn.setVisibility(View.INVISIBLE);
                    //Toast.makeText(this,"scanning error",Toast.LENGTH_SHORT).show();
                    showViews();
                    setValues();

                }
            } catch(Exception e) {
                e.printStackTrace();
            }
        }
    }
    public void scanBarcode() {
        try {
            Intent intent = new Intent(getApplicationContext(), CaptureActivity.class);
            intent.setAction("com.google.zxing.client.android.SCAN");
            intent.putExtra("SAVE_HISTORY", false);
            startActivityForResult(intent, 0);
        } catch(Exception e) {
            e.printStackTrace();
        }

    }
    public void EditBarCode(View view) {
        barcode.setEnabled(true);
        barcode.setClickable(true);
        barcode.setFocusable(true);
        barcode.setFocusableInTouchMode(true);
    }
    private void disableBarCode() {
        barcode.setEnabled(false);
        barcode.setClickable(false);
        barcode.setFocusable(false);
        barcode.setFocusableInTouchMode(false);
    }
    public void showHideViews() {
        //barcode.setVisibility(View.GONE);
        //edit_barcode_btn.setVisibility(View.GONE);
        //submit_btn.setVisibility(View.GONE);
        //scan_sensor.setVisibility(VISIBLE);
        beacon_name.setVisibility(VISIBLE);
        beacon_value.setVisibility(VISIBLE);
    }
    public void SubmitScanBarCode(View view) {
        if (barcode.toString().equalsIgnoreCase("")) {
            Toast.makeText(this, R.string.barcode_empty_check, Toast.LENGTH_SHORT).show();
            return;
        } else {
            submitBarCodeAPICall();
        }
    }
    private void submitBarCodeAPICall() {
        Timber.i("barcode api hit started");
       // new ProductDataRestCall(this,barcode.getText().toString(),this).execute();
    }
    /*@Override
    public void handleUI(final boolean result, final ProductData data) {
        new Handler(getMainLooper()).postDelayed(new Runnable() {
            @Override
            public void run() {
                tempMessage.setVisibility(View.GONE);
                displayMessage.setVisibility(VISIBLE);
               // header.setBackgroundColor(getResources().getColor(R.color.colorPrimaryDark));
                if(result) {
                    displayMessage.setText("No Alert Found");
                    //btn_ok.setVisibility(VISIBLE);
                    //mLoadingView.setViewState(com.dxc.loadingstateview.widget.LoadingStateView.STATE_SUCCESS);
                    // line.setVisibility(VISIBLE);
                    lb.loadingSuccessful();
                    new Handler(getMainLooper()).postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            builder.dismiss();
                            setValues(true,data);
                        }
                    },1000);
                    //start result Activity here for beacon communication
                    //launchResultScreen();
                    //mSpinner.dismiss();
                    //showResultDialog(false,BarcodeScannerActivity.this);
                    //disableBarCode();
                }
                else {
                    displayMessage.setText("Alert Found");
                    //btn_ok.setVisibility(VISIBLE);
                    //mLoadingView.setViewState(LoadingStateView.STATE_FAILED);
                    lb.loadingFailed();
                    new Handler(getMainLooper()).postDelayed(new Runnable() {
                        @Override
                        public void run() {
                           builder.dismiss();
                            setValues(false,data);
                        }
                    },1000);
                    //showResultDialog(result);
                }
            }
        },3000);

    }*/



    /*@Override
    public void startBeaconScanning() {
        mBeaconManager = BeaconManager.getInstanceForApplication(this.getApplicationContext());
        // Detect the main Eddystone-UID frame:
        mBeaconManager.getBeaconParsers().add(new BeaconParser().
                setBeaconLayout(BeaconParser.EDDYSTONE_UID_LAYOUT));
        mBeaconManager.bind(this);

    }*/

    public void scanSensor(View view) {
    }

  /*  @Override
    public void onBeaconServiceConnect() {
        // Set the two identifiers below to null to detect any beacon regardless of identifiers
        Identifier myBeaconNamespaceId = Identifier.parse("0x2f234454f4911ba9ffa6");
        Identifier myBeaconInstanceId = Identifier.parse("0x000000000001");
        Region region = new Region("my-beacon-region", myBeaconNamespaceId, myBeaconInstanceId, null);
        mBeaconManager.addMonitorNotifier(this);
        try {
            mBeaconManager.startMonitoringBeaconsInRegion(region);
        } catch (RemoteException e) {
            e.printStackTrace();
        }

    }

    @Override
    public void didEnterRegion(Region region) {
        Log.d(TAG, "I detected a beacon in the region with namespace id " + region.getId1() +
                " and instance id: " + region.getId2());

    }

    @Override
    public void didExitRegion(Region region) {

    }

    @Override
    public void didDetermineStateForRegion(int i, Region region) {

    }

    @Override
    public void didRangeBeaconsInRegion(Collection<Beacon> beacons, Region region) {
        for (Beacon beacon: beacons) {
            if (beacon.getServiceUuid() == 0xfeaa && beacon.getBeaconTypeCode() == 0x00) {
                // This is a Eddystone-UID frame
                Identifier namespaceId = beacon.getId1();
                Identifier instanceId = beacon.getId2();
                Log.d(TAG, "I see a beacon transmitting namespace id: "+namespaceId+
                        " and instance id: "+instanceId+
                        " approximately "+beacon.getDistance()+" meters away.");

                // Do we have telemetry data?
                if (beacon.getExtraDataFields().size() > 0) {
                    long telemetryVersion = beacon.getExtraDataFields().get(0);
                    long batteryMilliVolts = beacon.getExtraDataFields().get(1);
                    long pduCount = beacon.getExtraDataFields().get(3);
                    long uptime = beacon.getExtraDataFields().get(4);

                    Log.d(TAG, "The above beacon is sending telemetry version "+telemetryVersion+
                            ", has been up for : "+uptime+" seconds"+
                            ", has a battery level of "+batteryMilliVolts+" mV"+
                            ", and has transmitted "+pduCount+" advertisements.");

                }
            }
        }
    }*/
   /* public void showResultDialog(boolean result) {

        final android.support.v7.app.AlertDialog.Builder dialogBuilder = new android.support.v7.app.AlertDialog.Builder(this);

        LayoutInflater inflater = BarcodeScannerActivity.this.getLayoutInflater();

        View dialogView = inflater.inflate(R.layout.custom_meaasge_dialog, null);

        dialogBuilder.setView(dialogView);
        final android.support.v7.app.AlertDialog alertDialog;
        alertDialog = dialogBuilder.create();
        alertDialog.setCancelable(false);

        alertDialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        alertDialog.show();
        DisplayMetrics displayMetrics = new DisplayMetrics();
        this.getWindowManager().getDefaultDisplay().getMetrics(displayMetrics);
        int height = displayMetrics.heightPixels;
        int width = displayMetrics.widthPixels;
        alertDialog.getWindow().setLayout(width-40, (height /2 ));
        Button btn =  dialogView.findViewById(R.id.btn);
        //TextView resultMessage = dialogView.findViewById(R.id.resultMessage);
        //resultMessage.setText("beacon" + "12345 success");
        if(result) {
            btn.setBackgroundResource(R.drawable.ok_btn);
        }
        else {
            btn.setBackgroundResource(R.drawable.fail);
        }
        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                alertDialog.dismiss();
                showHideViews();
            }
        });

    }*/
    private void launchResultScreen() {
        Intent intent = new Intent(BarcodeScannerActivity.this, BeaconDataActivity.class);
        ProductStandardData p = ProductStandardData.getInstance();
        String beaconID = p.getBeaconID();
        intent.putExtra(EXTRA_BLUETOOTH_DEVICE_ADDRESS,beaconID);
        startActivity(intent);
    }
    private void writeToFile(int[] data,Context context) {
        try {
            File path = context.getExternalFilesDir(null);
            Timber.v("---path :" + path);
            File file = new File(path, "logs.txt");
            stream = new FileOutputStream(file);
            try {
                for(int i = 0; i < data.length; i++) {
                    stream.write(data[i]);
                }

            } catch (IOException e){
                Timber.e("writing log error");
            }
        }
        catch (IOException e) {
            Log.e("Exception", "File write failed: " + e.toString());
        }
    }
    private void closeStream() {
        try {
            stream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    public void showResultDialog(String message/*, final boolean result*/, Context context) {
        resultHandler = new Handler(getMainLooper());

        factory = LayoutInflater.from(context);
        dialogView = factory.inflate(R.layout.my_result_dialog, null);

        // Button buttonOk = dialogView.findViewById(R.id.buttonOk);
  /*      displayMessage = dialogView.findViewById(R.id.result);
        tempMessage = dialogView.findViewById(R.id.tempMessage);
        tempMessage.setVisibility(VISIBLE);
        tempMessage.setText(message);*/

       // btn_ok = dialogView.findViewById(R.id.btn_ok);

        //mLoadingView.setViewState(LoadingStateView.STATE_LOADING);

        /*lb = (LoadingButton)dialogView.findViewById(R.id.loading_btn);
        lb.setSoundEffectsEnabled(true);
        lb.startLoading();*/

        /*btn_ok.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                builder.dismiss();
            }
        });*/

        //lb.startLoading();
        //line = (View)  dialogView.findViewById(R.id.line);
      //  header = (RelativeLayout) dialogView.findViewById(R.id.header);
     //   buttonlayout = (RelativeLayout) dialogView.findViewById(R.id.buttonlayout);

        builder = new AlertDialog.Builder(context)
                //.setIconAttribute(android.R.attr.alertDialogIcon)
                .setView(dialogView).setCancelable(false)
                .create();
            new Handler(getMainLooper()).postDelayed(new Runnable() {
                @Override
                public void run() {
                    builder.show();
                }
            }, 1000);


        /*buttonlayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                builder.dismiss();
            }
        });*/


        /*resultHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                //lb.startLoading();
                builder.show();
                new Handler(getMainLooper()).postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        if(result) {
                            displayMessage.setText("Success");
                            lb.loadingSuccessful();
                            new Handler(getMainLooper()).postDelayed(new Runnable() {
                                @Override
                                public void run() {
                                    builder.dismiss();
                                }
                            },2000);
                        }
                        else {
                            lb.loadingFailed();
                            displayMessage.setText("Failure");
                            new Handler(getMainLooper()).postDelayed(new Runnable() {
                                @Override
                                public void run() {
                                    builder.dismiss();
                                }
                            },2000);
                        }
                    }
                },3000);

            }
        },1000);
*/
       /* lb.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                lb.startLoading(); //start loading
            }
        });*/
      /*  if(result)
            displayMessage.setText("Success");
        else
            displayMessage.setText("Failure");*/





        /*buttonOk.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                    builder.dismiss();
            }
        });*/
    }



    public void HandleClick(View view) {
        /*switch (view.getId()) {
            case R.id.loading_btn:
                mLoadingView.setViewState(com.dxc.loadingstateview.widget.LoadingStateView.STATE_LOADING);
                break;
            case R.id.success_btn:
                mLoadingView.setViewState(com.dxc.loadingstateview.widget.LoadingStateView.STATE_SUCCESS);
                break;
            case R.id.failed_btn:
                mLoadingView.setViewState(com.dxc.loadingstateview.widget.LoadingStateView.STATE_FAILED);
                break;
            case R.id.empty_btn:
                mLoadingView.setViewState(com.dxc.loadingstateview.widget.LoadingStateView.STATE_EMPTY_RESULT);
                break;
        }*/
    }
    private void setValues() {
        ProductData data = ProductData.getInstance();
        int temperatureAlertCount = data.getTemperatureAlerts();
        int humidityAlertCount = data.getHumidityAlerts();
        int vibrationAlertCount = data.getTamperAlerts(); // tamper is vibration
        int shockAlertCount = data.getShockAlerts();
        boolean alert = data.getAlertStatus();
        if(alert) {
            error.setVisibility(VISIBLE);
            success.setVisibility(View.GONE);
            product_name_value.setText(data.getPoduct());
            product_type_value.setText(data.getObjectType());
            product_id_value.setText(data.getObjectId());
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
                temperature_count.setTextColor(Color.parseColor("#ff0000"));
            }
            else {
                temperature_count.setTextColor(Color.parseColor("#ffffff"));
            }
            if(shockAlertCount > 0){
                shock_count.setTextColor(Color.parseColor("#ff0000"));
            }
            else {
                shock_count.setTextColor(Color.parseColor("#ffffff"));
            }
            humidity_count.setText(String.valueOf(humidityAlertCount));
            vibration_count.setText(String.valueOf(vibrationAlertCount));
            temperature_count.setText(String.valueOf(temperatureAlertCount));
            shock_count.setText(String.valueOf(shockAlertCount));
        }
        else {
            success.setVisibility(VISIBLE);
            error.setVisibility(View.GONE);
            product_name_value.setText(data.getPoduct());
            product_type_value .setText(data.getObjectType());
            product_id_value.setText(data.getObjectId());
            vibration_count.setTextColor(Color.parseColor("#ffffff"));
            humidity_count.setTextColor(Color.parseColor("#ffffff"));
            shock_count.setTextColor(Color.parseColor("#ffffff"));
            temperature_count.setTextColor(Color.parseColor("#ffffff"));
            humidity_count.setText("0");
            vibration_count.setText("0");
            temperature_count.setText("0");
            shock_count.setText("0");
        }

    }
    private void setCloudValues(ProductData data) {
        ProductData cloudData = ProductData.getInstance();
        int temperatureAlertCount = data.getTemperatureAlerts();
        int humidityAlertCount = data.getHumidityAlerts();
        int vibrationAlertCount = data.getTamperAlerts(); // tamper is vibration
        int shockAlertCount = data.getShockAlerts();
        boolean alert = data.getAlertStatus();
        if(alert) {
            error.setVisibility(VISIBLE);
            success.setVisibility(View.GONE);
            product_name_value.setText(data.getPoduct());
            product_type_value.setText(data.getObjectType());
            product_id_value.setText(data.getObjectId());
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
                 temperature_count.setTextColor(Color.parseColor("#ff0000"));
             }
             else {
                 temperature_count.setTextColor(Color.parseColor("#ffffff"));
             }
            if(shockAlertCount > 0){
                shock_count.setTextColor(Color.parseColor("#ff0000"));
            }
            else {
                shock_count.setTextColor(Color.parseColor("#ffffff"));
            }
            humidity_count.setText(String.valueOf(humidityAlertCount));
            vibration_count.setText(String.valueOf(vibrationAlertCount));
            temperature_count.setText(String.valueOf(temperatureAlertCount));
            shock_count.setText(String.valueOf(shockAlertCount));
        }
        else {
            success.setVisibility(VISIBLE);
            error.setVisibility(View.GONE);
            product_name_value.setText(data.getPoduct());
            product_type_value .setText(data.getObjectType());
            product_id_value.setText(data.getObjectId());
            vibration_count.setTextColor(Color.parseColor("#ffffff"));
            humidity_count.setTextColor(Color.parseColor("#ffffff"));
            shock_count.setTextColor(Color.parseColor("#ffffff"));
            temperature_count.setTextColor(Color.parseColor("#ffffff"));
            humidity_count.setText("0");
            vibration_count.setText("0");
            temperature_count.setText("0");
            shock_count.setText("0");
        }

    }
    private void parseData(final ProductData data) {
        new Handler(getMainLooper()).postDelayed(new Runnable() {
            @Override
            public void run() {
                boolean result = false;
                if(data.getStatus().equalsIgnoreCase("Alert")) {
                    result = true;
                }
               // tempMessage.setVisibility(View.GONE);
             //   displayMessage.setVisibility(VISIBLE);
                // header.setBackgroundColor(getResources().getColor(R.color.colorPrimaryDark));
                if(result) {
                   // displayMessage.setText("Alert Found");
                    //btn_ok.setVisibility(VISIBLE);
                    //mLoadingView.setViewState(com.dxc.loadingstateview.widget.LoadingStateView.STATE_SUCCESS);
                    // line.setVisibility(VISIBLE);
                  ///  lb.loadingFailed();
                    new Handler(getMainLooper()).postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            //setValues(true,data);
                            builder.dismiss();
                        }
                    },1000);
                    //start result Activity here for beacon communication
                    //launchResultScreen();
                    //mSpinner.dismiss();
                    //showResultDialog(false,BarcodeScannerActivity.this);
                    //disableBarCode();
                }
                else {
                    //displayMessage.setText("No Alert Found");
                    //btn_ok.setVisibility(VISIBLE);
                    //mLoadingView.setViewState(LoadingStateView.STATE_FAILED);
                   // lb.loadingSuccessful();
                    new Handler(getMainLooper()).postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            //setValues(false, data);
                            builder.dismiss();
                        }
                    },1000);
                    //showResultDialog(result);
                }
            }
        },3000);
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        finish();
    }
    private void findViewIds() {
        header = findViewById(R.id.header);
        status_icon = findViewById(R.id.status_icon);
        product_data = findViewById(R.id.product_data);
        bottom_line = findViewById(R.id.bottom_line);
        top_line = findViewById(R.id.top_line);
        launch_scan = findViewById(R.id.launch_scan);
        success = findViewById(R.id.success);
        error = findViewById(R.id.error);
        product_name_value = findViewById(R.id.product_name_value);
        product_type_value = findViewById(R.id.product_type_value);
        product_id_value = findViewById(R.id.product_id_value);
        humidity_count = findViewById(R.id.humidity_count);
        vibration_count = findViewById(R.id.vibration_count);
        temperature_count = findViewById(R.id.temp_count);
        shock_count = findViewById(R.id.shock_count);
        getbeaconrecord = findViewById(R.id.getbeaconrecord);
    }
    private void hideViews() {
        header.setVisibility(View.INVISIBLE);
        status_icon.setVisibility(View.INVISIBLE);
        product_data.setVisibility(View.INVISIBLE);
        bottom_line.setVisibility(View.INVISIBLE);
        top_line.setVisibility(View.INVISIBLE);
        launch_scan.setVisibility(View.INVISIBLE);
        getbeaconrecord.setVisibility(View.INVISIBLE);
    }
    private void showViews() {
        header.setVisibility(VISIBLE);
        status_icon.setVisibility(VISIBLE);
        product_data.setVisibility(VISIBLE);
        bottom_line.setVisibility(VISIBLE);
        top_line.setVisibility(VISIBLE);
        launch_scan.setVisibility(VISIBLE);
        getbeaconrecord.setVisibility(VISIBLE);
    }
    private void getCloudDataFromResponse(ProductData data) {
        ProductData cloudData = ProductData.getInstance();
        try {
            cloudData.setStatus(data.getStatus());
            cloudData.setHumidityAlerts(data.getHumidityAlerts());
            cloudData.setTamperAlerts(data.getTamperAlerts());
            cloudData.setTemperatureAlerts(data.getTemperatureAlerts());
            cloudData.setShockAlerts(data.getShockAlerts());
            cloudData.setBeaconId(data.getBeaconId());
            cloudData.setObjectId(data.getObjectId());
            cloudData.setPoduct(data.getPoduct());
            cloudData.setObjectType(data.getObjectType());
            cloudData.setAlertStatus(cloudData.getStatus().equalsIgnoreCase("Alert"));
        } catch (Exception e) {
            Timber.e(TAG,e.getMessage());
        }
    }
    private void launchBeaconDataActivity() {
        Intent intent = new Intent(this,BeaconDataActivity.class);
        String beaconID = ProductData.getInstance().getBeaconId().toUpperCase(); // test working "db06e517909a".toUpperCase();
        String macAddress = Utility.formMacAddress(beaconID);
        Utility.setMac(macAddress);
        startActivity(intent);
        finish();
    }

    public void getBeaconRecords(View view) {
        launchBeaconDataActivity();
    }
}
