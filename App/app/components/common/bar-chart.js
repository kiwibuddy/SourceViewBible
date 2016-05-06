/* @flow */
'use strict';

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

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
    backgroundColor: 'red'
  }
});

module.exports = {
  BarChart,
  Bar
}
