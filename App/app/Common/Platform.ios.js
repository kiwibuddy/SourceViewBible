/* @flow */
'use strict';

var Platform = {
  OS: 'ios',
  select: (obj: Object) => obj.ios,
};

module.exports = Platform;
