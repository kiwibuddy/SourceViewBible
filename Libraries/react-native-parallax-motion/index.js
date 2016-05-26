'use strict'

import React from 'react';

import {
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';

const RNParallaxMotion = NativeModules.RNParallaxMotion;

function startUpdates(updateInterval, callback) {
  RNParallaxMotion.startUpdatesWithUpdateInterval(updateInterval || 1000/60);
  DeviceEventEmitter.addListener('onParallaxMotionUpdate', callback);
};

function stopUpdates () {
  RNParallaxMotion.stopUpdates();
  DeviceEventEmitter.removeAllListeners('onParallaxMotionUpdate');
}

const ParallaxMotion = {
  startUpdates,
  stopUpdates
};

module.exports = ParallaxMotion;
