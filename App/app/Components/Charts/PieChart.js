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
  const chartStyle = [styles.chart, props.style, {width: size, height: size}];

  const sliceStyle = [styles.slice, {borderTopColor: color, borderLeftColor: color, borderBottomColor: color }];
  const label = props.label ? <Text style={styles.text}>{props.label}</Text> : null;

  return (
    <View style={chartStyle}>
        <View style={sliceStyle} />

    </View>
  );
};

PieChart.propTypes = {
  color: ColorPropType,
  data: PropTypes.any.isRequired,
  style: PropTypes.any,
  size: PropTypes.number.isRequired,
};

PieChart.defaultProps = {
  horizontal: true
}

const styles = StyleSheet.create({
  chart: {
    borderColor: 'red',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slice: {
    width: 0,
    height: 0,
    borderTopWidth: 24,
    borderTopColor: 'red',
    borderLeftColor: 'red',
    borderLeftWidth: 24,
    borderRightColor: 'red',
    borderRightWidth: 24,
    borderBottomColor: 'red',
    borderBottomWidth: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 24
  },
  text: {
    fontSize: 17,
  },
});

export default PieChart;
