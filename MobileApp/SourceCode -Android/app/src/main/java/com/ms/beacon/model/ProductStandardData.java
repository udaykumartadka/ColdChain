package com.ms.beacon.model;

import com.google.gson.annotations.SerializedName;

public class ProductStandardData {
    static ProductStandardData productStandardData;

    @SerializedName("BeaconId")
    private String BeaconId;  // this should be beacon mac address
    @SerializedName("MinTempLimit")
    private int minTempLimit;
    @SerializedName("MaxTempLimit")
    private int maxTempLimit;
    @SerializedName("MinHumLimit")
    private int minHumidityLimit;
    @SerializedName("MaxHumLimit")
    private int maxHumidityLimit;

    @SerializedName("ObjectId")
    private String ObjectId;

    public String getBeaconId() {
        return BeaconId;
    }

    public void setBeaconId(String beaconId) {
        BeaconId = beaconId;
    }

    public String getObjectId() {
        return ObjectId;
    }

    public void setObjectId(String objectId) {
        ObjectId = objectId;
    }

    public String getObjectType() {
        return ObjectType;
    }

    public void setObjectType(String objectType) {
        ObjectType = objectType;
    }

    public String getPoduct() {
        return Poduct;
    }

    public void setPoduct(String poduct) {
        Poduct = poduct;
    }

    public String getShockAlerts() {
        return ShockAlerts;
    }

    public void setShockAlerts(String shockAlerts) {
        ShockAlerts = shockAlerts;
    }

    public String getHumidityAlerts() {
        return HumidityAlerts;
    }

    public void setHumidityAlerts(String humidityAlerts) {
        HumidityAlerts = humidityAlerts;
    }

    public String getTemperatureAlerts() {
        return TemperatureAlerts;
    }

    public void setTemperatureAlerts(String temperatureAlerts) {
        TemperatureAlerts = temperatureAlerts;
    }

    public String getTamperAlerts() {
        return TamperAlerts;
    }

    public void setTamperAlerts(String tamperAlerts) {
        TamperAlerts = tamperAlerts;
    }

    @SerializedName("ObjectType")
    private String ObjectType;

    @SerializedName("Poduct")
    private String Poduct;

    @SerializedName("Status")
    private String Status;

    @SerializedName("ShockAlerts")
    private String ShockAlerts;

    @SerializedName("HumidityAlerts")
    private String HumidityAlerts;

    @SerializedName("TemperatureAlerts")
    private String TemperatureAlerts;

    @SerializedName("TamperAlerts")
    private String TamperAlerts;


    public String getStatus() {
        return status;
    }
    private ProductStandardData() {

    }
    public static ProductStandardData getInstance() {
        if(productStandardData == null) {
            productStandardData = new ProductStandardData();
        }
        return productStandardData;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @SerializedName("Status")
    private String status;

    public String getBeaconID() {
        return BeaconId;
    }

    public void setBeaconID(String beaconID) {
        this.BeaconId = beaconID;
    }

    public int getMinTempLimit() {
        return minTempLimit;
    }

    public void setMinTempLimit(int minTempLimit) {
        this.minTempLimit = minTempLimit;
    }

    public int getMaxTempLimit() {
        return maxTempLimit;
    }

    public void setMaxTempLimit(int maxTempLimit) {
        this.maxTempLimit = maxTempLimit;
    }

    public int getMinHumidityLimit() {
        return minHumidityLimit;
    }

    public void setMinHumidityLimit(int minHumidityLimit) {
        this.minHumidityLimit = minHumidityLimit;
    }

    public int getMaxHumidityLimit() {
        return maxHumidityLimit;
    }

    public void setMaxHumidityLimit(int maxHumidityLimit) {
        this.maxHumidityLimit = maxHumidityLimit;
    }

}
