/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import BarChart from './BarChart';

import { Colors, StyleSheet } from '../../Common';

const SPHERES = ['family', 'economics', 'government', 'religion', 'education', 'communication', 'celebration'];

const SpheresBarChart = (props: Object) => {
  const bars = props.data.map((data) => {
    const slices = SPHERES.map((sphere) => {
      const value = data[sphere];
      if (value === undefined) return null;
      return {
        color: Colors.spheres[sphere].tint,
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

SpheresBarChart.propTypes = {
  style: PropTypes.any,
  barStyle: PropTypes.any,
  data: PropTypes.any.isRequired,
  horizontal: PropTypes.bool
};

SpheresBarChart.defaultProps = {
  horizontal: true
}

export default SpheresBarChart;
