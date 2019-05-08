package com.ms.beacon.model;

public class BeaconData_ {

    BeaconData_ instance;

    private BeaconData_() {

    }


    public float getTemperature() {
        return temperature;
    }

    public void setTemperature(float temperature) {
        this.temperature = temperature;
    }

    public float getHumidity() {
        return humidity;
    }

    public void setHumidity(float humidity) {
        this.humidity = humidity;
    }

    public int getVibration() {
        return vibration;
    }

    public void setVibration(int vibration) {
        this.vibration = vibration;
    }

    public int getShock() {
        return shock;
    }

    public void setShock(int shock) {
        this.shock = shock;
    }

    float temperature;
    float humidity;
    int vibration;
    int shock;
}
