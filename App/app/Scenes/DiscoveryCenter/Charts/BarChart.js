/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Image,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  StyleSheet,
} from '../../../Common';

import Chart from './Chart';

type Props = {
  onPressChartType: Function,
};

const BarChart = (props: Props) => {
  return (
    <Chart>
      <Image source={require('../Images/chart-bar-blankslate.png')} />
      <Chart.Header>
        <Chart.DropdownButton
          image={require('../Images/chart-icn-bar-xaxis.png')}
          title="Choose X Axis"
          style={StyleSheet.styles.discoveryCenter.rightContainer}
        />
        <Chart.DropdownButton
          image={require('../Images/chart-icn-bar-yaxis.png')}
          title="Choose Y Axis"
          style={StyleSheet.styles.discoveryCenter.leftContainer}
        />
      </Chart.Header>
      <Chart.Footer>
        <View style={[StyleSheet.styles.discoveryCenter.leftContainer, {justifyContent: 'flex-start', paddingLeft: 5, borderRightWidth: 0}]}>
          <TouchableOpacity onPress={() => props.onPressChartType(Chart.Type.BAR)}>
            <Image source={require('../Images/chart-type-bar-s.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.onPressChartType(Chart.Type.PIE)}>
            <Image source={require('../Images/chart-type-pie.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.onPressChartType(Chart.Type.CLOUD)}>
            <Image source={require('../Images/chart-type-cloud.png')} />
          </TouchableOpacity>
        </View>
        <View style={[StyleSheet.styles.discoveryCenter.rightContainer, {justifyContent: 'flex-end', paddingRight: -10}]}>
          <TouchableOpacity>
            <Image source={require('../Images/btn-fullscreen.png')} />
          </TouchableOpacity>
        </View>
      </Chart.Footer>
    </Chart>
  );
};

export default BarChart;
