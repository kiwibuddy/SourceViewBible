package com.sourceviewbible;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.smixx.fabric.FabricPackage;
import org.pgsqlite.SQLitePluginPackage;
import com.rnfs.RNFSPackage;
import io.realm.react.RealmReactPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

import com.oblador.vectoricons.VectorIconsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.sourceviewbible.emdros.EmdrosReactPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new SQLitePluginPackage(),
          new FabricPackage(),
          new RNFSPackage(),
          new RealmReactPackage(),
          new VectorIconsPackage(),
          new LinearGradientPackage(),
          new EmdrosReactPackage(),
          new ReactNativeI18n()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
