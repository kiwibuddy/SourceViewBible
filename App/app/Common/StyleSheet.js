/* @flow */
'use strict';

import { StyleSheet } from 'react-native';
import Colors from './Colors';

function create(styles: Object) {
  return StyleSheet.create(styles);
};

const styles = {
  navigationBar: {
    doneButtonTitle: {
      color: Colors.tintColor,
      fontSize: 17,
      fontWeight: '500',
      marginLeft: 16
    },
  },
  wordCloud: {
    height: 200,
    backgroundColor: 'red',
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowRadius: 0.4,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  statisticsContainer: {
    flex: 0,
    flexDirection: 'row',
    marginTop: 5,
    borderBottomColor: Colors.separator,
    borderBottomWidth: StyleSheet.hairlineWidth,
    shadowColor: "black",
    shadowOpacity: 0.05,
    shadowRadius: 0.4,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  statisticContainer: {
    flex: 1,
  },
  statisticTitle: {
    fontSize: 24,
    color: Colors.tintColor,
    alignSelf: 'center'
  },
  statisticTitleBold: {
    fontSize: 34,
    fontWeight: '700',
    color: '#59626A',
    alignSelf: 'center'
  },
  statisticSubtitle: {
    flex: 1,
    color: Colors.subtitle,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  statisticKeyline: {
    flex:0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator
  },
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
    fontWeight: 'bold',
  },
  listItem: {
    paddingLeft: 15,
    paddingRight: 15,
    height: 44,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cell: {
    title: {
      color: '#59626a',
      fontSize: 17,
    },
    titlemedium: {
      color: '#59626a',
      fontSize: 15,
    },
    titlebold: {
      color: '#59626a',
      fontSize: 18,
      fontWeight: 'bold',
    },
    titlemore: {
      color: '#CF1E00',
      fontSize: 15,
    },
    subtitle: {
      color: '#9B9B9B',
      fontSize: 13,
    },
    percentage: {
      width: 40,
      fontSize: 13,
    },
    valuetitle: {
      color: '#9B9B9B',
      fontSize: 17,
    },
    valuetitlemedium: {
      color: '#9B9B9B',
      fontSize: 15,
    },
    body: {
      color: '#59626a',
      fontSize: 13,
    },
    bodybold: {
      color: '#59626a',
      fontSize: 14,
      fontWeight: 'bold',
    },
    occurence: {
      color: '#CF1E00',
      fontSize: 13,
      fontWeight: 'bold',
      width: 15,
    },
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
  },
};

module.exports = {
  absoluteFill: StyleSheet.absoluteFill,
  create: create,
  hairlineWidth: StyleSheet.hairlineWidth,
  styles: styles,
};
