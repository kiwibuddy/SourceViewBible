/* @flow */
'use strict';

var Platform = {
  OS: 'android',
  get Version() { return require('NativeModules').AndroidConstants.Version; },
  select: (obj: Object) => obj.android,
};

module.exports = Platform;
