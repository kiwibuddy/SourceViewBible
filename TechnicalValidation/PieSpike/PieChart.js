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

  const strokeWidth = 4;

  return (
    <View style={styles.chart}>
      <Svg width="200" height="200" viewBox="0 0 34 32" style={{margin: 10, backgroundColor: 'purple'}}>
        <Circle
          r="16" cx="17" cy="16"
          fill="transparent"
          stroke="gray"
          strokeWidth={strokeWidth/2}
          strokeDasharray={[100, 100]}
        />
        <Circle
          r="16" cx="17" cy="16"
          fill="transparent"
          stroke="blue"
          strokeWidth={strokeWidth/2}
          strokeDasharray={[75, 100]}
        />
        <Circle
          r="16" cx="17" cy="16"
          fill="transparent"
          stroke="green"
          strokeWidth={strokeWidth/2}
          strokeDasharray={[50, 100]}
        />
        <Circle
          r="16" cx="17" cy="16"
          fill="transparent"
          stroke="red"
          strokeWidth={strokeWidth/2}
          strokeDasharray={[25, 100]}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    backgroundColor: 'orange',
    transform: [{rotate: '-90deg'}],
  }
})

export default PieChart;
