package com.ms.beacon.service;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.os.AsyncTask;

import com.ms.beacon.R;
import com.ms.beacon.utils.Constants;
import com.ms.beacon.utils.Utility;
import com.ms.beacon.utils.WebServiceURL;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.HttpUrl;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

import static com.ms.beacon.parser.ProductResponseParser.parseNewProductResponse;
import static com.ms.beacon.parser.ProductResponseParser.parseProductResponse;
import static com.ms.beacon.utils.Constants.APP_URL_ENCODED;
import static com.ms.beacon.utils.Utility.displayToast;
import static com.ms.beacon.utils.WebServiceURL.CONTENT_TYPE;
import static com.ms.beacon.utils.WebServiceURL.PRODUCT_INFO_DATA;

public class ProductDataRestCall extends AsyncTask<Void,Void,Void> {
    private Context mContext;
    private String objectID;
    private String responseText;
    private int responseCode = 0;
    MainActivityCallBack mainActivityCallBack;
    ProgressDialog mSpinner;

    public ProductDataRestCall(Context context, String objectID, MainActivityCallBack mainActivityCallBack) {
        this.mContext = context;
        this.objectID = objectID;
        this.mainActivityCallBack = mainActivityCallBack;
    }

    @Override
    protected void onPreExecute() {
        super.onPreExecute();
       /* mSpinner = new ProgressDialog(mContext);
        mSpinner.setMessage(mContext.getResources().getString(R.string.barcode_spinner));
        mSpinner.setCancelable(false);
        mSpinner.isIndeterminate();
        mSpinner.show();*/
    }

    @Override
    protected Void doInBackground(Void... voids) {

        OkHttpClient client = new OkHttpClient();
        HttpUrl.Builder urlBuilder
                = HttpUrl.parse(PRODUCT_INFO_DATA+objectID).newBuilder();
        //urlBuilder.addQueryParameter("deviceid", objectID);
        String url = urlBuilder.build().toString();
        Request request = new Request.Builder()
                .url(url)
                .build();
        Call call = client.newCall(request);
        Response response = null;
        try {
            response = call.execute();
            responseCode = response.code();
            responseText = response.body().string();
        } catch (IOException e) {
            e.printStackTrace();
        }


//        MediaType mediaType = MediaType.parse(APP_URL_ENCODED);
//        RequestBody body = RequestBody.create(mediaType, "="+);
//        Request request = new Request.Builder()
//                .url(PRODUCT_INFO_DATA)
//                .post(body)
//                .addHeader(CONTENT_TYPE, APP_URL_ENCODED)
//                .build();
//
//        try {
//            Response response;
//            response = client.newCall(request).execute();
//            responseText = response.body().string();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
        return null;
    }

    @Override
    protected void onPostExecute(Void aVoid) {
        super.onPostExecute(aVoid);
        if (responseCode == 200) {
            if(responseText != null && !responseText.equalsIgnoreCase("")) {
                boolean result = parseNewProductResponse(responseText);
                if(result) {
                    mainActivityCallBack.handleUI(true);
                    //Utility.showSuccessAnimation(mContext.getResources().getString(R.string.success),mContext);
                }
                else {
                    mainActivityCallBack.handleUI(false);
                }
            }
            else {
                mainActivityCallBack.handleUI(true);
                //displayToast(mContext,mContext.getString(R.string.network_error));
                //original code displayToast(mContext,mContext.getString(R.string.network_error));
            }
        }
        else {
            //currently sending trrue
            mainActivityCallBack.handleUI(false);
            displayToast(mContext,mContext.getString(R.string.network_error));
        }
        //mSpinner.dismiss();

    }
    public interface MainActivityCallBack {
        void handleUI(boolean result);
        void startBeaconScanning();
    }
}
