/* @flow */
"use strict";

import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';

import { Colors, StyleSheet } from '../../Common';

const SPHERES = ['family', 'economics', 'government', 'religion', 'education', 'communication', 'celebration'];

const SpheresBarChart = (props: Object) => {
  const chartStyle = [styles.chart, props.style];
  const stackedBarStyle = [styles.stackedBar, {flexDirection: props.horizontal ? 'row' : 'column'}, props.barStyle];
  const spheres = (props.horizontal ? SPHERES : SPHERES.slice().reverse());

  let barIndex = 0;
  const bars = props.data.map((data) => {
    const bar = spheres.map((sphere) => {
      const value = data[sphere];
      if (value == undefined) return null;

      const barStyle = {
        backgroundColor: Colors.spheres[sphere].tint,
        marginTop: (props.horizontal ? 0 : Math.floor(Math.random() * 12)),
        flex: value
      }
      return (
        <View key={'sphere-' + sphere} style={barStyle} />
      );
    });
    if (!bar) return null;

    return (
      <View key={'bar-' + barIndex++} style={stackedBarStyle}>
        {bar}
      </View>
    )
  });

  return (
    <View style={chartStyle}>
      {bars}
    </View>
  );
}

SpheresBarChart.propTypes = {
  style: PropTypes.any,
  barStyle: PropTypes.any,
  data: PropTypes.any.isRequired,
  horizontal: PropTypes.bool
};

SpheresBarChart.defaultProps = {
  horizontal: true
}

const styles = StyleSheet.create({
  chart: {
    flex: 1,
    flexDirection: 'row',
  },
  stackedBar: {
    flex: 1,
    backgroundColor: '#ededed'
  }
});

export default SpheresBarChart;
