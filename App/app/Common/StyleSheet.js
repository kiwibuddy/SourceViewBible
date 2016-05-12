/* @flow */
'use strict';

import { StyleSheet } from 'react-native';

function create(styles: any) {
  const defaultStyles = {
    ...styles,
    sectionHeaderContainer: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#c8c7cc',
      paddingBottom: 6,
      backgroundColor: 'white',
    },
    sectionHeaderTitle: {
      color: '#cf1e00',
      marginTop: 8,
      fontSize: 13,
    },
  };

  return StyleSheet.create(defaultStyles);
};

module.exports = {
  hairlineWidth: StyleSheet.hairlineWidth,
  create: create,
};
