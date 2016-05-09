/* @flow */
'use strict';

import { StyleSheet } from 'react-native';

function create(styles: any) {
  return StyleSheet.create(styles);
};

module.exports = {
  hairlineWidth: StyleSheet.hairlineWidth,
  create: create,
};
