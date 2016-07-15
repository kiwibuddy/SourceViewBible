/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import BarChart from './BarChart';

import StyleSheet from '../../Common/StyleSheet';
import Colors from '../../Common/Colors';

const SOURCES = ['narrator', 'god', 'lead', 'support'];

const SourcesBarChart = (props: Object) => {
  const bars = props.data.map((data) => {
    const slices = SOURCES.map((source) => {
      const value = data[source];
      if (value === undefined) return null;
      return {
        color: Colors.sources[source].tint,
        value: value
      };
    }).filter(bar => bar != null);

    return {slices};
  });

  return (
    <BarChart
      {...props}
      bars={bars}
    />
  );
};

SourcesBarChart.propTypes = {
  style: PropTypes.any,
  barStyle: PropTypes.any,
  data: PropTypes.any.isRequired,
  horizontal: PropTypes.bool
};

SourcesBarChart.defaultProps = {
  horizontal: true
}

export default SourcesBarChart;
