#!/bin/sh

adb shell "pm uninstall com.sourceviewbible"
adb shell "rm -rf /data/app/com.sourceviewbible-*"

if [ -z "$1" ]
  then
    react-native run-android
else
  react-native run-android --variant release
fi
