package com.sourceviewbible;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.horcrux.svg.RNSvgPackage;
import co.instea.RNAppInfo.RNAppInfoPackage;
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
import java.io.UnsupportedEncodingException;

import com.oblador.vectoricons.VectorIconsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.sourceviewbible.emdros.EmdrosReactPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;

public class MainApplication extends Application implements ReactApplication {
  private static final byte[] RCTLicenseKeyCString = new byte[] {77, 73, 73, 66, 73, 106, 65, 78, 66, 103, 107, 113, 104, 107, 105, 71, 57, 119, 48, 66, 65, 81, 69, 70, 65, 65, 79, 67, 65, 81, 56, 65, 77, 73, 73, 66, 67, 103, 75, 67, 65, 81, 69, 65, 106, 85, 89, 49, 117, 82, 67, 82, 118, 89, 99, 65, 48, 112, 88, 80, 81, 82, 97, 113, 84, 90, 67, 69, 75, 67, 82, 97, 119, 98, 115, 48, 113, 56, 120, 99, 66, 87, 86, 47, 100, 104, 79, 101, 43, 80, 121, 53, 86, 109, 67, 115, 107, 82, 90, 90, 73, 119, 97, 87, 99, 72, 43, 83, 108, 119, 56, 99, 108, 71, 79, 76, 78, 97, 97, 99, 53, 51, 83, 110, 57, 66, 66, 122, 90, 113, 106, 66, 71, 49, 118, 86, 121, 84, 88, 87, 105, 101, 87, 87, 120, 106, 78, 80, 55, 54, 80, 72, 114, 80, 54, 102, 75, 51, 104, 43, 43, 117, 50, 50, 105, 122, 88, 85, 53, 57, 99, 67, 75, 110, 55, 105, 53, 89, 43, 68, 47, 80, 73, 77, 43, 98, 99, 68, 72, 90, 71, 71, 117, 74, 83, 86, 73, 77, 70, 49, 70, 54, 67, 55, 49, 48, 87, 83, 88, 98, 110, 119, 88, 78, 98, 73, 99, 52, 74, 98, 111, 82, 66, 103, 53, 89, 113, 43, 115, 106, 106, 108, 105, 76, 122, 49, 115, 114, 100, 102, 111, 67, 98, 76, 100, 99, 66, 89, 86, 122, 49, 68, 81, 111, 72, 43, 54, 57, 97, 116, 73, 54, 68, 122, 105, 69, 112, 86, 98, 104, 122, 104, 54, 116, 108, 118, 53, 86, 81, 48, 53, 119, 79, 54, 77, 103, 81, 103, 81, 120, 98, 113, 82, 66, 106, 69, 89, 74, 89, 87, 81, 55, 43, 56, 82, 118, 57, 82, 118, 77, 80, 88, 49, 71, 107, 48, 86, 81, 73, 71, 72, 107, 99, 101, 70, 87, 70, 56, 49, 88, 97, 68, 47, 70, 100, 101, 103, 109, 54, 106, 117, 110, 75, 101, 114, 54, 76, 121, 68, 112, 70, 103, 48, 65, 112, 105, 108, 55, 89, 53, 87, 67, 105, 48, 107, 66, 66, 54, 56, 49, 48, 66, 48, 88, 113, 119, 85, 100, 81, 77, 109, 118, 55, 121, 49, 119, 73, 68, 65, 81, 65, 66};

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      String licenseKey = "";
      try {
        licenseKey = new String(RCTLicenseKeyCString, "US-ASCII");
      } catch (UnsupportedEncodingException e) {
        Log.v("Emdros", "uh oh: " + e.toString());
      }

      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new RNDeviceInfo(),
          new InAppBillingBridgePackage(licenseKey),
          new RNSvgPackage(),
          new RNAppInfoPackage(),
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
