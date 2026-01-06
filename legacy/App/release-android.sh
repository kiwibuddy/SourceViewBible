#!/bin/sh

cd android && ./gradlew assembleRelease
cd ..
echo "android/app/build/outputs/apk/app-release.apk"
open "android/app/build/outputs/apk/"
