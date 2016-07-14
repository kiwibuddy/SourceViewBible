/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
} from 'react-native';
import ColorPropType from 'ColorPropType';

import StyleSheet from '../../Common/StyleSheet';
import Colors from '../../Common/Colors';

const PieChart = (props: Object) => {
  const { color, size } = props;
  const chartStyle = [styles.chart, props.style, {width: size, height: size, borderRadius: size/2, borderColor: color, borderWidth: 1}];

  const sliceStyle = [styles.slice, {borderTopColor: color, borderLeftColor: color, borderBottomColor: color }];
  const label = props.label ? <Text style={[styles.text, {color: color}]}>{props.label}</Text> : null;

  return (
    <View style={chartStyle}>
      {label}
    </View>
  );
};

PieChart.propTypes = {
  color: ColorPropType,
  slices: PropTypes.arrayOf(PropTypes.shape({
    color: ColorPropType,
    value: PropTypes.number.isRequired,
  })).isRequired,
  style: PropTypes.any,
  size: PropTypes.number.isRequired,
};

PieChart.defaultProps = {
  horizontal: true
}

const styles = StyleSheet.create({
  chart: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 17,
  },
});

export default PieChart;
