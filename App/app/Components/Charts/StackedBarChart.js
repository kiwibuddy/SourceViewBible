/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { BarChart, Bar } from './BarChart';

import StyleSheet from '../../Common/StyleSheet';
import Colors from '../../Common/Colors';

const sources = ['black', 'red', 'green', 'blue'];

const StackedBarChart = (props: Object) => {
  const chartStyle = [styles.chart, props.style];
  const stackedBarStyle = [styles.stackedBar, {flexDirection: props.horizontal ? 'row' : 'column'}];

  const bars = props.data.map((data) => {
    return sources.map((source) => {
      const color = Colors.sources[source];

      return (
        <Bar
          key={'source-' + source}
          style={{backgroundColor: color}}
        />
      );
    });
  });

  return (
    <BarChart style={chartStyle}>
      <View style={stackedBarStyle}>
        {bars}
      </View>
    </BarChart>
  );
}

StackedBarChart.propTypes = {
  style: PropTypes.any,
  data: PropTypes.any.isRequired,
  horizontal: PropTypes.bool
};

StackedBarChart.defaultProps = {
  horizontal: false
}

const styles = StyleSheet.create({
  chart: {
    flex: 1
  },
  stackedBar: {
    flex: 1
  }
});

export default StackedBarChart;
