package com.harvestemdros;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

import android.content.res.AssetManager;
import java.io.IOException;
import android.util.Log;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.os.Environment;

import com.sourceviewbible.emdros.*; // import the Emdros package

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        AssetManager assetManager = getAssets();
        try {
          String out = getFilesDir().toString();
          Log.v("Emdros", "Internal storage: " + out);

          String[] files = assetManager.list("");
          for (String filename : files) {
            Log.v("Emdros", "Asset File: " + filename);
          }

          // String intStorageDirectory = getFilesDir().toString();
          // File folder = new File(intStorageDirectory, "testthreepdf");
          // folder.mkdirs();
          //
          InputStream myinput = assetManager.open("sourceview.bpt");
          String outfilename = "/data/user/0/com.androidemdros/files/sourceview.bpt";
          OutputStream myoutput = new FileOutputStream(outfilename);
          byte[] buffer = new byte[1024];
          int length;
          while ((length = myinput.read(buffer))>0) {
              myoutput.write(buffer,0,length);
          }
          myoutput.flush();
          myoutput.close();
          myinput.close();

          Log.v("Emdros", "Copied: " + outfilename);

        } catch (IOException e) {
             Log.v("Emdros", "uh oh: " + e.toString());
        }

        return "HarvestEmdros";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new EmdrosReactPackage() // include Emdros in getPackages
        );
    }
}
