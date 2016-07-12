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
        <View style={StyleSheet.styles.wordCloud}>
          <Image style={styles.wordCloudButton} source={require('../../Images/common/btn-expand.png')} />
        </View>
        <View style={styles.listContainer}>
          <View style={StyleSheet.styles.listItem}>
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
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 15,
  },
  wordCloudButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  }
});
