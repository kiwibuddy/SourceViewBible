/* @flow */
'use strict';

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

class BarChart extends Component {
  props: {
    style: any;
  };

  render() {
    return (
      <View style={[styles.container, this.props.style]}>

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
    backgroundColor: 'red',
    height: 2
  }
});

module.exports = {
  BarChart,
  Bar
}
