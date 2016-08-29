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
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import java.lang.Thread;
import android.util.Log;
import java.util.Map;
import java.util.Map.Entry;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.lang.Math;
import java.io.File;
import java.io.UnsupportedEncodingException;

public class EmdrosModule extends ReactContextBaseJavaModule {
  private static final byte[] RCTKeyCString = new byte[] {51, 102, 97, 98, 50, 101, 100, 99, 100, 56, 54, 54, 51, 99, 54, 98, 97, 97, 57, 49, 102, 102, 101, 98, 57, 50, 56, 101, 99, 54, 49, 101, 48, 49, 49, 98, 49, 57, 101, 100, 56, 54, 54, 100, 55, 51, 54, 53, 101, 55, 100, 49, 57, 52, 101, 52, 51, 100, 99, 52, 55, 50, 54, 52};
  private static final String RCTKey = "Key";

  private static final byte[] RCTPreferencesKeyCString = new byte[] {98, 53, 50, 101, 55, 51, 49, 50, 53, 48, 99, 101, 56, 49, 101, 56, 52, 51, 50, 50, 57, 102, 52, 48, 102, 102, 100, 55, 50, 101, 49, 101, 49, 57, 54, 48, 52, 48, 52, 51, 54, 50, 50, 101, 49, 56, 97, 52, 53, 50, 57, 49, 53, 53, 52, 52, 100, 99, 97, 98, 97, 102, 98, 57};
  private static final String RCTPreferencesKey = "PreferencesKey";

  private static final long MAX_MONAD = 2100000000L;

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
  public void string(ReadableMap options, final Promise promise) {
    String name = options.getString("name");
    final Emdros emdros = this.openedDatabases.get(name);

    final long from = options.getInt("from");
    final long to = options.getInt("to");
    final String stylesheet = options.getString("stylesheet");

    Thread thread = new Thread(new Runnable(){
      @Override
      public void run(){
        String string = emdros.string(from, to, stylesheet);
        promise.resolve(string);
      }
    });
    thread.start();
  }

  @ReactMethod
  public void wordsInMonads(ReadableMap options, final Promise promise) {
    String name = options.getString("name");
    final Emdros emdros = this.openedDatabases.get(name);

    final long[][] monads;
    if (options.hasKey("from") && options.hasKey("to")) {
      long from = options.getInt("from");
      long to = options.getInt("to");
      monads = new long[1][2];
      monads[0][0] = from;
      monads[0][1] = to;
    } else if (options.hasKey("monads")) {
      ReadableArray monadArray = options.getArray("monads");
      int size = monadArray.size();
      monads = new long[size][2];
      for (int i = 0; i < size; i++) {
        ReadableArray monad = monadArray.getArray(i);
        monads[i][0] = monad.getInt(0);
        monads[i][1] = monad.getInt(1);
      }
    } else {
      monads = new long[1][2];
      monads[0][0] = 1;
      monads[0][1] = MAX_MONAD;
    }

    final int limit = options.hasKey("limit") ? options.getInt("limit") : 0;
    final boolean useStopWords = options.hasKey("useStopWords") ? options.getBoolean("useStopWords") : false;

    Thread thread = new Thread(new Runnable(){
      @Override
      public void run(){
        Map<String,Integer> wordCountMap = emdros.words(monads, limit, useStopWords);
        Set<Entry<String,Integer>> wordCountEntries = wordCountMap.entrySet();
        List<Entry<String,Integer>> wordCountList = new LinkedList<Entry<String,Integer>>(wordCountEntries);

        Collections.sort(wordCountList, new Comparator<Entry<String,Integer>>() {
          @Override
          public int compare(Entry<String, Integer> a, Entry<String, Integer> b) {
            return b.getValue().compareTo(a.getValue());
          }
        });

        if (limit > 0) wordCountList = wordCountList.subList(0, Math.min(limit, wordCountList.size()));

        WritableArray wordCounts = Arguments.createArray();
        for (Entry<String,Integer> word: wordCountList) {
          WritableMap wordCount = Arguments.createMap();
          wordCount.putString("string", word.getKey());
          wordCount.putInt("count", word.getValue());
          wordCounts.pushMap(wordCount);
        }

        promise.resolve(wordCounts);
      }
    });
    thread.start();
  }

  @ReactMethod
  public void wordCountsForContext(ReadableMap options, final Promise promise) {
    String name = options.getString("name");
    final Emdros emdros = this.openedDatabases.get(name);

    final long[][] monads;
    if (options.hasKey("monads")) {
      ReadableArray monadArray = options.getArray("monads");
      int size = monadArray.size();
      monads = new long[size][2];
      for (int i = 0; i < size; i++) {
        ReadableArray monad = monadArray.getArray(i);
        monads[i][0] = monad.getInt(0);
        monads[i][1] = monad.getInt(1);
      }
    } else {
      monads = new long[1][2];
      monads[0][0] = 1;
      monads[0][1] = MAX_MONAD;
    }

    final String context = options.hasKey("context") ? options.getString("context") : "";
    final String contextFeatureComparison = options.hasKey("contextFeatureComparison") ? options.getString("contextFeatureComparison") : "";
    final String tokenFeatureComparison = options.hasKey("tokenFeatureComparison") ? options.getString("tokenFeatureComparison") : "";

    Thread thread = new Thread(new Runnable(){
      @Override
      public void run(){
        Map<String,Map<String,Integer>> wordCountMap = emdros.wordCountsForContext(context, monads, contextFeatureComparison, tokenFeatureComparison);
        Set<Entry<String,Map<String,Integer>>> wordCountEntries = wordCountMap.entrySet();

        WritableMap wordCounts = Arguments.createMap();
        for (Entry<String,Map<String,Integer>> word: wordCountEntries) {
          String contextID = word.getKey();
          Map<String,Integer> wordMap = word.getValue();

          WritableMap wordCount = Arguments.createMap();
          wordCount.putInt("wordCount", wordMap.get("wordCount"));
          wordCount.putInt("family", wordMap.get("family"));
          wordCount.putInt("economics", wordMap.get("economics"));
          wordCount.putInt("government", wordMap.get("government"));
          wordCount.putInt("religion", wordMap.get("religion"));
          wordCount.putInt("education", wordMap.get("education"));
          wordCount.putInt("communication", wordMap.get("communication"));
          wordCount.putInt("celebration", wordMap.get("celebration"));

          wordCounts.putMap(contextID, wordCount);
        }

        promise.resolve(wordCounts);
      }
    });
    thread.start();
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    try {
      String key = new String(RCTKeyCString, "US-ASCII");
      constants.put(RCTKey, key);

      String preferencesKey = new String(RCTPreferencesKeyCString, "US-ASCII");
      constants.put(RCTPreferencesKey, preferencesKey);
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
