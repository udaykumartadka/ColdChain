package com.ms.beacon.ui;

import android.app.Application;
import android.os.Build;

import com.ms.beacon.BuildConfig;
import com.ms.beacon.logs.ReleaseLogs;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;


import timber.log.Timber;

public class MyApplication extends Application {
  @Override
  public void onCreate() {
    super.onCreate();
    if(BuildConfig.DEBUG) {
      Timber.plant(new Timber.DebugTree(){
        @Override
        protected @Nullable String createStackElementTag(@NotNull StackTraceElement element) {
          return super.createStackElementTag(element) + ':' + element.getMethodName();
        }
      });
    }
    else {
      //Release mode
      Timber.plant(new ReleaseLogs());
    }
  }
}
