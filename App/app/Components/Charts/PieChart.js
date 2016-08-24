/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ColorPropType from 'ColorPropType';

import Svg,{
    Circle,
} from 'react-native-svg';


const DEFAULT_SLICE_WIDTH = 4;

import StyleSheet from '../../Common/StyleSheet';
import Colors from '../../Common/Colors';

const PieChart = (props: Object) => {
  const { color, size, slices: data, titleStyle, subtitleStyle } = props;
  const chartStyle = [styles.chart, props.style, {width: size, height: size}];
  const strokeWidth = 4;
  return (
    <TouchableOpacity style={chartStyle} onPress={props.onPress}>
      <View style={styles.pie}>
        <Svg width={size} height={size} viewBox="0 0 34 32">
          <Circle
            r="16" cx="17" cy="16"
            fill="transparent"
            stroke="gray"
            strokeWidth={strokeWidth/2}
            strokeDasharray={[25, 100]}
            strokeDashoffset={-75}
          />
          <Circle
            r="16" cx="17" cy="16"
            fill="transparent"
            stroke="blue"
            strokeWidth={strokeWidth/2}
            strokeDasharray={[25, 100]}
            strokeDashoffset={-50}
          />
          <Circle
            r="16" cx="17" cy="16"
            fill="transparent"
            stroke="green"
            strokeWidth={strokeWidth/2}
            strokeDasharray={[25, 100]}
            strokeDashoffset={-25}
          />
          <Circle
            r="16" cx="17" cy="16"
            fill="transparent"
            stroke="red"
            strokeWidth={strokeWidth/2}
            strokeDasharray={[25, 100]}
            strokeDashoffset={0}
          />
        </Svg>
      </View>
    </TouchableOpacity>

  );
}

const styles = StyleSheet.create({
  chart: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pie: {
    transform: [{rotate: '-90deg'}],
  },
  title: {
    fontSize: 17,
  },
  subtitle: {
    fontSize: 14,
    color: '#59626A',
    textAlign: 'center',
  },
})

export default PieChart;
