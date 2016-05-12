/* @flow */
'use strict';

import { StyleSheet } from 'react-native';

function create(styles: any) {
  const defaultStyles = {
    ...styles,
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: '#CCCCCC',
      marginLeft: 8,
    },
    section: {
      marginLeft: 15,
    },
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
    sectionText: {
      marginVertical: 8,
      lineHeight: 20,
    },
    sectionMore: {
      color: '#cf1e00',
      alignSelf: 'flex-end',
      marginRight: 10,
    },
    roundButton: {
      borderRadius: 20,
      borderWidth: 1,
      paddingVertical: 4,
      paddingHorizontal: 5,
      alignItems: 'center',
    },
    roundButtonTitle: {
      fontSize: 11,
    },
  };

  return StyleSheet.create(defaultStyles);
};

module.exports = {
  hairlineWidth: StyleSheet.hairlineWidth,
  create: create,
};
