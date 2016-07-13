/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';

import { Colors, StyleSheet } from '../../Common';

const SPHERES = ['family', 'economics', 'government', 'religion', 'education', 'communication', 'celebration'];

const SpheresBarChart = (props: Object) => {
  const chartStyle = [styles.chart, props.style];
  const stackedBarStyle = [styles.stackedBar, {flexDirection: props.horizontal ? 'row' : 'column'}, props.barStyle];
  const spheres = (props.horizontal ? SPHERES : SPHERES.slice().reverse());

  let maxChartValue = props.maxChartValue || 0;
  if (props.maxChartValue == null) {
    props.data.forEach((data, index) => {
      let maxBarValue = 0;
      spheres.forEach((sphere, index) => {
          const value = data[sphere] || 0;
          maxBarValue += value;
      });
      if (maxBarValue > maxChartValue) {
        maxChartValue = maxBarValue;
      }
    });
  }

  let barIndex = 0;
  const bars = props.data.map((data) => {
    let maxBarValue = 0;
    const bar = spheres.map((sphere) => {
      const value = data[sphere];
      if (value === undefined) return null;
      maxBarValue += value;

      const barStyle = {
        backgroundColor: Colors.spheres[sphere].tint,
        flex: value
      }
      return (
        <View key={'sphere-' + sphere} style={barStyle} />
      );
    });
    if (!bar) return null;

    const delta = maxChartValue - maxBarValue;
    const deltaBar = delta > 0 ? <View key='deltaBar' style={[{flex: delta}, styles.deltaBar]} /> : null;
    let chart = null;
    if (props.horizontal) {
      chart = [bar, deltaBar];
    } else {
      chart = [deltaBar, bar];
    }
    return (
      <View key={'bar-' + barIndex++} style={stackedBarStyle}>
        {chart}
      </View>
    )
  });

  return (
    <View style={chartStyle}>
      {bars}
    </View>
  );
};

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
  deltaBar: {
    backgroundColor: '#ededed',
  },
  stackedBar: {
    flex: 1,
  }
});

export default SpheresBarChart;
