Source View Bible Mobile App Setup
==================================

# React Native
  * http://facebook.github.io/react-native/docs/getting-started.html#content

## Install Homebrew
* http://brew.sh

If Homebrew is already installed make sure it is up-to-date:

$ `brew update`

## Install NVM (Node Version Manager)
  * https://github.com/creationix/nvm#installation

## Install Node
$ `nvm install node && nvm alias default node`

## Install Watchman
$ `brew install watchman`

## Install Flow
$ `brew install flow`

## Install React Native
$ `npm install -g react-native-cli`

# Android
  * http://facebook.github.io/react-native/docs/android-setup.html#content

## Install Gradle
$ `brew install gradle`

## Enable Gradle Daemon
$ `touch ~/.gradle/gradle.properties && echo "org.gradle.daemon=true" >> ~/.gradle/gradle.properties`

## Install Android NDK
$ `brew install android-ndk`

## Install Android SDK
$ `brew install android-sdk`

## Add Android NDK and SDK to ~/.bash_profile
`export ANDROID_HOME=/usr/local/opt/android-sdk`

`export ANDROID_NDK=/usr/local/Cellar/android-ndk/r11b`


# App Dependencies
$ `npm install`

## Starting the Packager
$ `react-native start`

## Starting Android Emulator
$ `android avd`
