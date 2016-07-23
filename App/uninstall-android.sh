#!/bin/sh

adb shell "pm uninstall com.sourceviewbible"
adb shell "rm -rf /data/app/com.sourceviewbible-*"
