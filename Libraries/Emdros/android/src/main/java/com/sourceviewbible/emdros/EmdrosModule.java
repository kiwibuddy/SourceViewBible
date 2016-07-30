package com.sourceviewbible.emdros;

import javax.annotation.Nullable;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import android.util.Log;
import java.util.Map;
import java.util.HashMap;
import java.io.File;
import java.io.UnsupportedEncodingException;

public class EmdrosModule extends ReactContextBaseJavaModule {
  private static final byte[] RCTKeyCString = new byte[] {51, 102, 97, 98, 50, 101, 100, 99, 100, 56, 54, 54, 51, 99, 54, 98, 97, 97, 57, 49, 102, 102, 101, 98, 57, 50, 56, 101, 99, 54, 49, 101, 48, 49, 49, 98, 49, 57, 101, 100, 56, 54, 54, 100, 55, 51, 54, 53, 101, 55, 100, 49, 57, 52, 101, 52, 51, 100, 99, 52, 55, 50, 54, 52};
  private static final String RCTKey = "KEY";

  private ReactApplicationContext context;
  private Map<String, Emdros> openedDatabases;

  public EmdrosModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.context = reactContext;
    this.openedDatabases = new HashMap<String, Emdros>();
  }

  @Override
  public String getName() {
    return "Emdros";
  }

  // Javascript API
  @ReactMethod
  public void open(ReadableMap options, Promise promise) {
    String name = options.getString("name");
    String databasePath = this.context.getFilesDir().toString() + File.separator + name;
    Emdros emdros = this.openedDatabases.get(name);

    if (emdros != null) {
      promise.resolve(null);
    } else {
      emdros = new Emdros(this.createHashMap(options));
      emdros.connect(databasePath);
      this.openedDatabases.put(name, emdros);
      promise.resolve(null);
    }
  }

  @ReactMethod
  public void string(ReadableMap options, Promise promise) {
    String name = options.getString("name");
    long from = options.getInt("from");
    long to = options.getInt("to");
    String stylesheet = options.getString("stylesheet");

    Emdros emdros = this.openedDatabases.get(name);
    String string = emdros.string(from, to, stylesheet);
    promise.resolve(string);
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    try {
      String key = new String(RCTKeyCString, "US-ASCII");
      constants.put(RCTKey, key);
    } catch (UnsupportedEncodingException e) {
      Log.v("Emdros", "uh oh: " + e.toString());
    }
    return constants;
  }

  // Private
  private WritableMap createReactMap(Map<String, String> v) {
        WritableMap map = Arguments.createMap();
        for (Map.Entry<String, String> entry : v.entrySet()) {
            map.putString(entry.getKey(), entry.getValue());
        }
        return map;
    }

  private Map<String, String> createHashMap(ReadableMap v) {
      Map<String, String> map = new HashMap<String, String>();
      ReadableMapKeySetIterator it = v.keySetIterator();
      while (it.hasNextKey()) {
        String key = it.nextKey();
        map.put(key, v.getString(key));
      }
      return map;
  }
}
