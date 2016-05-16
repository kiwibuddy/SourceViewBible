/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import StyleSheet from '../../Common/StyleSheet';

const BarChart = (props: Object) => (
  <View style={[styles.container, props.style]}>
    {props.children}
  </View>
)

BarChart.propTypes = {
  props: PropTypes.object
}

const Bar = (props: Object) => (
  <View style={[styles.bar, props.style]}></View>
)

Bar.propTypes = {
  props: PropTypes.object
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
