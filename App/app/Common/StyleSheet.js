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
    paddingBottom: 6,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  sectionHeaderTitle: {
    color: Colors.tintColor,
    marginTop: 8,
    fontSize: 13,
  },
  cellTitle: {
    color: '#59626a',
    fontSize: 17,
  },
  cellSubTitle: {
    color: '#B7C0C8',
    fontSize: 13,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#CCCCCC',
  },
};

module.exports = {
  styles: styles,
  hairlineWidth: StyleSheet.hairlineWidth,
  create: create,
};
