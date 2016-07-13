/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Text,
  View
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
});
