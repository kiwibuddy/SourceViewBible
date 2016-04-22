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

public class EmdrosModule extends ReactContextBaseJavaModule {
  private Map<String, Emdros> openedDatabases;

  public EmdrosModule(ReactApplicationContext reactContext) {
    super(reactContext);
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
    Emdros emdros = this.openedDatabases.get(name);

    if (emdros != null) {
      promise.resolve(null);
    } else {
      emdros = new Emdros(this.createHashMap(options));
      emdros.connect();
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

    Log.v("Emdros", "Stylesheet: " + stylesheet);

    Emdros emdros = this.openedDatabases.get(name);
    String string = emdros.string(from, to, stylesheet);
    promise.resolve(string);
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
