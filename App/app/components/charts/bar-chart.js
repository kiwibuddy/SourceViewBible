/* @flow */
'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';
const StyleSheet = require('../../common/stylesheet');

class BarChart extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
      {this.props.children}
      </View>
    );
  }
}

class Bar extends Component {
  render() {
    return (
      <View style={[styles.bar, this.props.style]}></View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bar: {
    flex: 1,
  }
});

module.exports = {
  BarChart,
  Bar
}
