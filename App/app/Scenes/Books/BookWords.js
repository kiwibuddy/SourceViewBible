/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Text,
  View,
  Image
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

export default class BookWords extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.wordCloud}>
          <Image style={styles.wordCloudButton} source={require('../../Images/common/btn-expand.png')} />
        </View>
        <View style={styles.listContainer}>
          <View style={styles.listItem}>
            <Text style={StyleSheet.styles.cell.title}>Word</Text>
            <Text style={StyleSheet.styles.cell.valuetitle}>0</Text>
          </View>
          <View style={styles.separator} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  listItem: {
    paddingLeft: 15,
    paddingRight: 15,
    height: 44,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator,
    marginLeft: 15,
  },
  wordCloudButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  }
});
