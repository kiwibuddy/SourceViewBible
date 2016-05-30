/* @flow */
"use strict";

import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';

import StyleSheet from '../../Common/StyleSheet';
import Colors from '../../Common/Colors';

const SOURCES = ['narrator', 'god', 'lead', 'support'];

const SourcesBarChart = (props: Object) => {
  const chartStyle = [styles.chart, props.style];
  const stackedBarStyle = [styles.stackedBar, {flexDirection: props.horizontal ? 'row' : 'column'}, props.barStyle];
  const sources = (props.horizontal ? SOURCES : SOURCES.slice().reverse());

  let maxChartValue = props.maxChartValue || 0;
  if (props.maxChartValue == null) {
    props.data.forEach((data, index) => {
      let maxBarValue = 0;
      sources.forEach((source, index) => {
          const value = data[source] || 0;
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
    const bar = sources.map((source) => {
      const value = data[source];
      if (value === undefined) return null;
      maxBarValue += value;

      const barStyle = {
        backgroundColor: Colors.sources[source],
        flex: value
      }
      return (
        <View key={'source-' + source} style={barStyle} />
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
}

SourcesBarChart.propTypes = {
  style: PropTypes.any,
  barStyle: PropTypes.any,
  data: PropTypes.any.isRequired,
  horizontal: PropTypes.bool
};

SourcesBarChart.defaultProps = {
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

export default SourcesBarChart;
