/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { BarChart, Bar } from './BarChart';

import StyleSheet from '../../Common/StyleSheet';
import Colors from '../../Common/Colors';

const StackedBarChart = (props: Object) => {
  const chartStyle = [styles.chart, props.style];
  const stackedBarStyle = [styles.stackedBar, {flexDirection: props.horizontal ? 'row' : 'column'}];

  return (
    <BarChart style={chartStyle}>
      <View style={stackedBarStyle}>
        <Bar
          style={{backgroundColor: Colors.sources.black}}
          dataKey={'black'}
        />
        <Bar
          style={{backgroundColor: Colors.sources.red}}
          dataKey={'red'}
        />
        <Bar
          style={{backgroundColor: Colors.sources.green}}
          dataKey={'green'}
        />
        <Bar
          style={{backgroundColor: Colors.sources.blue}}
          dataKey={'blue'}
        />
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
