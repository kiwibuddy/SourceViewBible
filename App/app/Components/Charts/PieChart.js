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


const DEFAULT_SLICE_WIDTH = 3;

import StyleSheet from '../../Common/StyleSheet';
import Colors from '../../Common/Colors';

const PieChart = (props: Object) => {
  const { color, size, slices: data, titleStyle, subtitleStyle } = props;
  const chartStyle = [styles.chart, props.style, {width: size, height: size}];
  const sliceWidth = props.sliceWidth;

  const title = props.title ? <Text numberOfLines={1} style={[styles.title, {color: color}, titleStyle]}>{props.title}</Text> : null;
  const subtitle = props.subtitle ? <Text numberOfLines={1} style={[styles.subtitle, subtitleStyle]}>{props.subtitle}</Text> : null;

  const slices = data.filter(slice => slice.value > 0);
  const sum = slices.reduce((sum, slice) => sum += slice.value, 0);

  let runningTotal = 0;
  const pieSlices = slices.map((slice, index) => {
    const slicePercent = (slice.value / sum) * 100;

    const pieSlice = <Circle
      key={'slice-' + index}
      r="16" cx="18" cy="18"
      fill="transparent"
      stroke={slice.color}
      strokeWidth={sliceWidth}
      strokeDasharray={[slicePercent, 100]}
      strokeDashoffset={-runningTotal}
    />;

    runningTotal += slicePercent;
    return pieSlice;
  });

  return (
    <TouchableOpacity style={chartStyle} onPress={props.onPress}>
      <View style={[styles.pie, StyleSheet.absoluteFill]}>
        <Svg width={size} height={size} viewBox="0 0 36 36">
          {pieSlices}
        </Svg>
      </View>
      {title}
      {subtitle}
    </TouchableOpacity>
  );
}

PieChart.propTypes = {
  color: ColorPropType,
  onPress: PropTypes.func,
  slices: PropTypes.arrayOf(PropTypes.shape({
    color: ColorPropType.isRequired,
    value: PropTypes.number.isRequired,
  })).isRequired,
  sliceWidth: PropTypes.number,
  style: PropTypes.any,
  size: PropTypes.number.isRequired,
  subtitle: PropTypes.string,
  subtitleStyle: PropTypes.any,
  title: PropTypes.string,
  titleStyle: PropTypes.any,
};

PieChart.defaultProps = {
  sliceWidth: DEFAULT_SLICE_WIDTH,
};

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
