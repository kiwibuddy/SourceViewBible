/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ColorPropType from 'ColorPropType';

import Svg,{
    Circle,
} from 'react-native-svg';


const PieChart = (props: Object) => {
  const strokeWidth = 4;
  return (
    <View style={styles.chart}>
      <Svg width="200" height="200" viewBox="0 0 34 32">
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
    transform: [{rotate: '-90deg'}],
  }
})

export default PieChart;
