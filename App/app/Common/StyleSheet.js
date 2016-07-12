/* @flow */
'use strict';

import { StyleSheet } from 'react-native';
import Colors from './Colors';

function create(styles: Object) {
  return StyleSheet.create(styles);
};

const styles = {
  sectionHeaderContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c8c7cc',
    paddingVertical: 6,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  sectionHeaderTitle: {
    color: '#59626a',
    marginTop: 8,
    fontSize: 13,
  },
  cell: {
    title: {
      color: '#59626a',
      fontSize: 17,
    },
    subtitle: {
      color: '#9B9B9B',
      fontSize: 13,
    },
    valuetitle: {
      color: '#9B9B9B',
      fontSize: 17,
    },
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
  },
};

module.exports = {
  styles: styles,
  hairlineWidth: StyleSheet.hairlineWidth,
  create: create,
};
