package com.sourceviewbible;

import com.facebook.react.ReactActivity;
import com.rnfs.RNFSPackage;
import io.realm.react.RealmReactPackage;

import java.util.Arrays;
import java.util.List;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.os.Environment;
import android.content.res.AssetManager;
import java.io.IOException;
import android.util.Log;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.File;

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        AssetManager assetManager = getAssets();
        try {
            String database =  "Datasets" + File.separator + "en" + File.separator + "NLT" + File.separator + "SourceView.bpt";
            String outfilename = getFilesDir().toString() + File.separator + database;
            File outfile = new File(outfilename);
            File directory = outfile.getParentFile();
            if (!directory.exists()) {
              if (directory.mkdirs()) {
                Log.v("Emdros", "Created directory");
              } else {
                Log.v("Emdros", "Shoot, could not create directory");
              }
            } else {
              Log.v("Emdros", "Directory exists:" + directory);
            }

            if (!outfile.exists()) {
              Log.v("Emdros", "Internal storage: " + outfilename);

              String[] files = assetManager.list("");
              for (String filename : files) {
                Log.v("Emdros", "Asset File: " + filename);
              }

              InputStream myinput = assetManager.open("sourceview" + File.separator + database);
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
            }
        } catch (IOException e) {
             Log.v("Emdros", "uh oh: " + e.toString());
        }
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "SourceViewBible";
    }
}
