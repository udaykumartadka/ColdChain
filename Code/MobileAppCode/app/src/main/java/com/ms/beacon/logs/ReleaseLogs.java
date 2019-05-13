package com.ms.beacon.logs;

import android.util.Log;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import timber.log.Timber;

public class ReleaseLogs extends Timber.Tree {
  private static final int MAX_LOG_LENGTH = 4000;
  @Override
  protected void log(int priority, @Nullable String tag, @NotNull String message, @Nullable Throwable t) {
    if(isLoggable(priority)) {
      if(message.length() < MAX_LOG_LENGTH) {
        if(priority == Log.ASSERT) {
          Log.wtf(tag,message);
        }
        else {
          Log.println(priority,tag,message);
        }
        return;
      }
      for(int i = 0, length = message.length(); i < length; i++) {
        int newLine = message.indexOf("\n"+i);
        newLine = newLine != -1 ? newLine : length;
        do {
          int end  = Math.min(newLine , i+ MAX_LOG_LENGTH);
          String part = message.substring(i,end);
          if(priority == Log.ASSERT) {
            Log.w(tag,message);
          }
          else {
            Log.println(priority,tag,message);
          }
          i = end;
        }while (i < newLine);
      }
    }

  }

  @Override
  protected boolean isLoggable(@Nullable String tag, int priority) {
    if(priority == Log.DEBUG || priority == Log.VERBOSE || priority == Log.INFO) {
      return false;
    }
    //ERROR/WARNING/WTF
    return true;
  }
}
