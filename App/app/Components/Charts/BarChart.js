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

const BarChart = (props: Object) => {
  const chartStyle = [styles.chart, props.style];
  const stackedBarStyle = [styles.stackedBar, {flexDirection: props.horizontal ? 'row' : 'column'}, props.barStyle];
  const bars = (props.horizontal ? props.bars.slice(0).reverse() : props.bars.slice(0));

  bars.forEach((bar) => {
    if (bar.slices != null) {
      bar.value = bar.slices.reduce((barValue, slice) => barValue + slice.value, 0);
    } else {
      bar.slices = [bar];
    }
  });

  const maxChartValue = props.maxChartValue ||  Math.max.apply(Math, bars.map(bar => bar.value));

  const barGraphs = bars.map((bar, barIndex) => {
    const barGraph = bar.slices.map((slice, sliceIndex) => <View key={'bar-slice-' + sliceIndex} style={{backgroundColor: slice.color || props.barColor, flex: slice.value}} />);

    const delta = maxChartValue - bar.value;
    const deltaBarGraph = delta > 0 ? <View key={'deltaBar-' + barIndex} style={[styles.deltaBar, props.deltaStyle, {flex: delta}]} /> : null;
    let chart = null;
    if (props.horizontal) {
      chart = [barGraph, deltaBarGraph];
    } else {
      chart = [deltaBarGraph, barGraph];
    }

    let label = null;
    if (bar.label) {
      label = <Text style={styles.label}>{bar.label}</Text>;
    }

    return (
      <View key={'bar-' + barIndex} style={stackedBarStyle}>
        {chart}
        {label}
      </View>
    )
  });

  return (
    <View style={chartStyle}>
      {barGraphs}
    </View>
  );
};

BarChart.propTypes = {
  bars: PropTypes.arrayOf(PropTypes.shape({
    color: ColorPropType,
    value: PropTypes.number,
    slices: PropTypes.arrayOf(PropTypes.shape({
      color: ColorPropType,
      value: PropTypes.number.isRequired,
    })),
  })).isRequired,
  barColor: ColorPropType,
  barStyle: PropTypes.any,
  deltaStyle: PropTypes.any,
  horizontal: PropTypes.bool,
  style: PropTypes.any,
};

BarChart.defaultProps = {
  horizontal: true
}

const styles = StyleSheet.create({
  chart: {
    flex: 1,
    flexDirection: 'row',
  },
  deltaBar: {
    backgroundColor: '#ededed',
  },
  stackedBar: {
    flex: 1,
  },
  label: {
    height: 8,
    width: 40,
    fontSize: 8,
    textAlign: 'right',
    color: 'white',
    backgroundColor: 'transparent',
    transform: [{rotate: '270deg'}],
  },
});

export default BarChart;
