package com.ms.beacon.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class ProductData {
    static ProductData data;

    @SerializedName("BeaconId")
    private String beaconId;
    @SerializedName("ObjectId")
    private String objectId;
    @SerializedName("ObjectType")
    private String objectType;
    @SerializedName("Poduct")
    private String poduct;
    @SerializedName("Status")
    private String status;
    @SerializedName("HumidityAlerts")
    private int humidityAlerts;
    @SerializedName("TemperatureAlerts")
    private int temperatureAlerts;
    @SerializedName("TamperAlerts")
    private int tamperAlerts;
    @SerializedName("ShockAlerts")
    private int shockAlerts;

    public boolean getAlertStatus() {
        return alertStatus;
    }

    public void setAlertStatus(boolean alertStatus) {
        this.alertStatus = alertStatus;
    }

    private boolean alertStatus;

    public float getTemperatureUpperLimit() {
        return temperatureUpperLimit;
    }

    public void setTemperatureUpperLimit(float temperatureUpperLimit) {
        this.temperatureUpperLimit = temperatureUpperLimit;
    }

    public float getTemperatureLowerLimit() {
        return temperatureLowerLimit;
    }

    public void setTemperatureLowerLimit(float temperatureLowerLimit) {
        this.temperatureLowerLimit = temperatureLowerLimit;
    }

    public float getHumidityLowerLimit() {
        return humidityLowerLimit;
    }

    public void setHumidityLowerLimit(float humidityLowerLimit) {
        this.humidityLowerLimit = humidityLowerLimit;
    }

    public float getHumidityUpperLimit() {
        return humidityUpperLimit;
    }

    public void setHumidityUpperLimit(float humidityUpperLimit) {
        this.humidityUpperLimit = humidityUpperLimit;
    }

    @SerializedName("TemperatureUpperLimit")
    private float temperatureUpperLimit;
    @SerializedName("TemperatureLowerLimit")
    private float temperatureLowerLimit;
    @SerializedName("HumidityLowerLimit")
    private float humidityLowerLimit;
    @SerializedName("HumidityUpperLimit")
    private float humidityUpperLimit;

    private ProductData() {

    }
    public static ProductData getInstance() {
        if(data == null) {
            data = new ProductData();
        }
        return data;
    }
    public String getBeaconId() {
        return beaconId;
    }

    public void setBeaconId(String beaconId) {
        this.beaconId = beaconId;
    }

    public String getObjectId() {
        return objectId;
    }

    public void setObjectId(String objectId) {
        this.objectId = objectId;
    }

    public String getObjectType() {
        return objectType;
    }

    public void setObjectType(String objectType) {
        this.objectType = objectType;
    }

    public String getPoduct() {
        return poduct;
    }

    public void setPoduct(String poduct) {
        this.poduct = poduct;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getHumidityAlerts() {
        return humidityAlerts;
    }

    public void setHumidityAlerts(int humidityAlerts) {
        this.humidityAlerts = humidityAlerts;
    }

    public int getTemperatureAlerts() {
        return temperatureAlerts;
    }

    public void setTemperatureAlerts(int temperatureAlerts) {
        this.temperatureAlerts = temperatureAlerts;
    }

    public int getTamperAlerts() {
        return tamperAlerts;
    }

    public void setTamperAlerts(int tamperAlerts) {
        this.tamperAlerts = tamperAlerts;
    }

    public int getShockAlerts() {
        return shockAlerts;
    }

    public void setShockAlerts(int shockAlerts) {
        this.shockAlerts = shockAlerts;
    }

}
