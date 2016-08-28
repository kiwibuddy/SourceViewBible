#!/bin/sh

adb shell "pm uninstall com.sourceviewbible"
adb shell "rm -rf /data/app/com.sourceviewbible-*"

react-native run-android --variant ${1:debug}
