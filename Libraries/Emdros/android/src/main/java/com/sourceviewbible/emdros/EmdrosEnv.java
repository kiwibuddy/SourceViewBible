package com.sourceviewbible.emdros;

import java.util.Map;
import java.util.HashMap;
import android.util.Log;

public class EmdrosEnv {
  private long emdrosEnv;
  private Map<String, String> options;

  public EmdrosEnv(Map<String,String> options) {
    Log.v("Emdros", "new Emdros() " + options.toString());
    this.options = options;
  }

  public native void connect();

  static {
    Log.v("Emdros", "static");
    System.loadLibrary("Emdros");
    Log.v("Emdros", "loadLibrary");
  }
}
