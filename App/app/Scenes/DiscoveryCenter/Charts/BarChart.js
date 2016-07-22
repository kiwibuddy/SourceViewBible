/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Image,
} from 'react-native';

import {
  StyleSheet,
} from '../../../Common';

import Chart from './Chart';

const BarChart = (props: Object) => {
  return (
    <Chart>
      <Image source={require('../Images/chart-blankslate.png')} />
      <Chart.Header>
        <Chart.DropdownButton
          image={require('../Images/chart-icn-bar-yaxis.png')}
          title="Choose Y Axis"
          style={StyleSheet.styles.discoveryCenter.leftContainer}
        />
        <Chart.DropdownButton
          image={require('../Images/chart-icn-bar-xaxis.png')}
          title="Choose X Axis"
          style={StyleSheet.styles.discoveryCenter.rightContainer}
        />
      </Chart.Header>
      <Chart.Footer />
    </Chart>
  );
};

export default BarChart;
