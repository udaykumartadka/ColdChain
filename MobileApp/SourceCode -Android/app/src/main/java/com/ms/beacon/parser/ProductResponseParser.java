package com.ms.beacon.parser;

import com.ms.beacon.model.ProductStandardData;

import org.json.JSONException;
import org.json.JSONObject;

import timber.log.Timber;

public class ProductResponseParser {
    private static final String TAG = "ProductResponseParser";

    /**
     *This function will parse Alert info, beacon ID, max temp, min temp, max humidity, min humidity and
     * save in values DS. and return the result.
     * @param response
     * @return boolean
     */
    public static boolean parseProductResponse(String response) {
        JSONObject dataObj;//jsonObject ;
        try {
            dataObj = new JSONObject(response);
          /*  if(true)
            return true;*/
            //String status = jsonObject.getString("Status");
            if(true)  { // original code if(status.equals("Success")){
                //JSONObject dataObj = jsonObject.getJSONObject("data");
                String product_Status  = dataObj.getString("Status");
                if(product_Status.equalsIgnoreCase("Green")) {
                    ProductStandardData productStandardData = ProductStandardData.getInstance();
                    productStandardData.setBeaconID(dataObj.getString("BeaconID"));
                    productStandardData.setMinTempLimit(dataObj.getInt("MinTempLimit"));
                    productStandardData.setMaxTempLimit(dataObj.getInt("MaxTempLimit"));
                    productStandardData.setMinHumidityLimit(dataObj.getInt("MinHumLimit"));
                    productStandardData.setMaxHumidityLimit(dataObj.getInt("MaxHumLimit"));
                    productStandardData.setStatus(product_Status);
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        } catch (JSONException e) {
            Timber.e("json parsing error");
        } catch (Exception e) {
            Timber.e("unknown error");
        }
        return false;
    }

    public static boolean parseNewProductResponse(String response) {
        JSONObject dataObj;//jsonObject ;
        try {
            dataObj = new JSONObject(response);
          /*  if(true)
            return true;*/
            //String status = jsonObject.getString("Status");
           // if(true)  { // original code if(status.equals("Success")){
                //JSONObject dataObj = jsonObject.getJSONObject("data");
            String BeaconId  = dataObj.getString("BeaconId");
            String ObjectId  = dataObj.getString("ObjectId");
            String ObjectType  = dataObj.getString("ObjectType");
            String Poduct  = dataObj.getString("Poduct");
            String Status  = dataObj.getString("Status");
            String HumidityAlerts  = dataObj.getString("HumidityAlerts");
            String TemperatureAlerts  = dataObj.getString("TemperatureAlerts");
            String TamperAlerts  = dataObj.getString("TamperAlerts");
            String ShockAlerts  = dataObj.getString("ShockAlerts");


                    ProductStandardData productStandardData = ProductStandardData.getInstance();
                    productStandardData.setBeaconID(BeaconId);
                    productStandardData.setObjectId(ObjectId);
                    productStandardData.setObjectType(ObjectType);
                    productStandardData.setPoduct(Poduct);
                    productStandardData.setStatus(Status);
                    productStandardData.setTemperatureAlerts(TemperatureAlerts);
                    productStandardData.setTamperAlerts(TamperAlerts);
                    productStandardData.setShockAlerts(ShockAlerts);
                    productStandardData.setHumidityAlerts(HumidityAlerts);

                    if(!Status.equalsIgnoreCase("Alert")) // not alert found success case
                    return true;
                    else
                        return false;

        } catch (JSONException e) {
            Timber.e("json parsing error");
        } catch (Exception e) {
            Timber.e("unknown error");
        }
        return false;
    }
}
