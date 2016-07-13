/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

export default class SphereOverview extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.carouselContainer}>
        </View>
        <View style={styles.carouselGraphContainer}>
          <View style={[styles.carouselGraph, {width: 150}]} />
        </View>
        <View style={StyleSheet.styles.statisticsContainer}>
          <TouchableOpacity style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitle}>0</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Books</Text>
          </TouchableOpacity>
          <View style={styles.keyline} />
          <TouchableOpacity style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitle}>0</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Sources</Text>
          </TouchableOpacity>
          <View style={styles.keyline} />
          <TouchableOpacity style={StyleSheet.styles.statisticContainer}>
            <Text style={StyleSheet.styles.statisticTitle}>0</Text>
            <Text style={StyleSheet.styles.statisticSubtitle}>Words</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselContainer: {
    height: 250,
    backgroundColor: '#E1E9EE',
  },
  carouselGraphContainer: {
    height: 2,
    backgroundColor: '#D8D8D8',
  },
  carouselGraph: {
    height: 2,
    backgroundColor: 'red',
  },
  keyline: {
    flex:0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator
  },
});
