package com.sourceviewbible.emdros;

import java.util.Map;
import java.util.HashMap;

public class Emdros {
  private long emdrosEnv;
  private Map<String, String> options;

  public Emdros(Map<String,String> options) {
    this.options = options;
  }

  public native void connect();

  static {
      System.loadLibrary("Emdros");
  }
}
