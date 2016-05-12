/* @flow */
'use strict';

import { StyleSheet } from 'react-native';

function create(styles: any) {
  const defaultStyles = {
    ...styles
  };

  return StyleSheet.create(defaultStyles);
};

module.exports = {
  hairlineWidth: StyleSheet.hairlineWidth,
  create: create,
};
