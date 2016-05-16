/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';

import StyleSheet from '../../Common/StyleSheet';
import Colors from '../../Common/Colors';

const SOURCES = ['narrator', 'god', 'lead', 'support'];

const SourcesBarChart = (props: Object) => {
  const chartStyle = [styles.chart, props.style];
  const stackedBarStyle = [styles.stackedBar, {flexDirection: props.horizontal ? 'row' : 'column'}, props.barStyle];
  const sources = (props.horizontal ? SOURCES : SOURCES.slice().reverse());

  const bars = props.data.map((data) => {
    const bar = sources.map((source) => {
      return (
        <View key={'source-' + source} style={{backgroundColor: Colors.sources[source], flex: data[source]}} />
      );
    });

    return (
      <View key={'bar-' + data.name} style={stackedBarStyle}>
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
  stackedBar: {
    flex: 1
  }
});

export default SourcesBarChart;
