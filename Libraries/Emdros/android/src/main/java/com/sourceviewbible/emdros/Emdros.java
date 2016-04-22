package com.sourceviewbible.emdros;

import java.util.Map;
import java.util.HashMap;

public class Emdros {
  private long emdrosEnv;
  private Map<String, String> options;

  public Emdros(Map<String,String> options) {
    this.options = options;
  }

  public native void connect(String databasePath);
  public native String string(long from, long to, String options);

  // Only used for cleanup of resources. Not called explicitly
  public native void dispose();

  static {
    System.loadLibrary("Emdros");
  }
}
