/* @flow */
'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import Svg,{
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Symbol,
    Use,
    Defs,
    Stop
} from 'react-native-svg';

const PieChart = (props: Object) => {
  const circleRadius = 25;

  /* 2π × 25 */
  const radius = 2 * Math.PI * circleRadius;

  return (
    <View style={styles.chart}>
      <Svg width="100" height="100" viewBox="0 0 32 32">
        <Circle
          r="16" cx="16" cy="16"
          fill="transparent"
          stroke="#655"
          strokeWidth={3}
          strokeDasharray={[50, 100]}
        />
        {/* <Circle
          r="42" cx="50" cy="50"
          fill="transparent"
          stroke="red"
          strokeWidth={6}
          strokeDasharray={[40, 189]}
        /> */}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    // flex: 1,
    backgroundColor: 'yellowgreen',
    transform: [{rotate: '-90deg'}],
  }
})

export default PieChart;
