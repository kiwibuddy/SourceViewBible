package com.sourceviewbible.emdros;

import java.util.Map;
import java.util.HashMap;
import android.util.Log;

public class Emdros {
  private long emdrosEnv;
  private Map<String, String> options;

  public Emdros(Map<String,String> options) {
    Log.v("Emdros", "new Emdros() " + options.toString());
    this.options = options;
  }

  public native void connect();

  static {
    Log.v("Emdros", "static");

    // System.loadLibrary("stlport_shared");
    // Log.v("Emdros", "loaded stlport_shared");

    System.loadLibrary("Emdros");
    Log.v("Emdros", "loaded Emdros");
  }
}
