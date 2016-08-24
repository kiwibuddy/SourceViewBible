package com.textlayout;

import com.facebook.react.ReactActivity;

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
import android.util.Log;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.File;

public class MainActivity extends ReactActivity {
  protected void copyAsset(String sourcePath, String destinationPath) {
    try {
      AssetManager assetManager = getAssets();

      File destinationFile = new File(destinationPath);
      File destinationDirectory = destinationFile.getParentFile();
      if (!destinationDirectory.exists()) {
        destinationDirectory.mkdirs();
      }

      if (!destinationFile.exists()) {
        Log.v("Emdros", "Internal storage: " + destinationPath);

        // String[] files = assetManager.list("");
        // for (String filename : files) {
        //   Log.v("Emdros", "Asset File: " + filename);
        // }

        InputStream sourceInputStream = assetManager.open(sourcePath);
        OutputStream destinationOutputStream = new FileOutputStream(destinationPath);
        byte[] buffer = new byte[1024];
        int length;
        while ((length = sourceInputStream.read(buffer)) > 0) {
            destinationOutputStream.write(buffer, 0, length);
        }
        destinationOutputStream.flush();
        destinationOutputStream.close();
        sourceInputStream.close();

        Log.v("Emdros", "Copied: " + destinationPath);
      }
    } catch (IOException e) {
         Log.v("Emdros", "uh oh: " + e.toString());
    }
  }

  @Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    String filesDirectoryPath = getFilesDir().toString();

    String emdrosSourcePath = "sourceview/Datasets/en/NLT/SourceView.bpt";
    String emdrosDestinationPath = filesDirectoryPath + "/Datasets/en/NLT/SourceView.bpt";
    copyAsset(emdrosSourcePath, emdrosDestinationPath);

    // String realmSourcePath = "sourceview/Datasets/en/NLT/SourceView.realm";
    // String realmDestinationPath = filesDirectoryPath + "/Datasets/en/NLT/SourceView.realm";
    // copyAsset(realmSourcePath, realmDestinationPath);

    // We do not need to copy the file over. react-native-sqlite-storage will do that for us.
    // String sqliteSourcePath = "sourceview/Datasets/en/NLT/SourceView.sqlite3";
    // String sqliteDestinationPath = filesDirectoryPath + "/Datasets/en/NLT/SourceView.sqlite3";
    // copyAsset(sqliteSourcePath, sqliteDestinationPath);
}

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "TextLayout";
    }
}
