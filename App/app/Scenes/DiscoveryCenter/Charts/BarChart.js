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

import { axisItemsURL } from '../../../Navigation';

type Props = {
  card: Object,
  onPressAxis: Function,
  onPressChartType: Function,
};

const BarChart = (props: Props) => {
  const { card } = props;

  let xAxisTitle = "Choose X Axis";
  if (props.card.xAxis) {
    xAxisTitle = props.card.xAxis.name;
  }

  let yAxisTitle = "Choose Y Axis";
  if (props.card.yAxis) {
    yAxisTitle = props.card.yAxis.name;
  }

  return (
    <Chart>
      <View style={StyleSheet.styles.discoveryCenter.chartContainer}>
        <Image source={require('../Images/chart-bar-blankslate.png')} />
      </View>
      <Chart.Header>
        <Chart.DropdownButton
          image={require('../Images/chart-icn-bar-xaxis.png')}
          onPress={() => props.onPressAxis(axisItemsURL({title: "Choose X Axis", axis: 'xAxis'}))}
          title={xAxisTitle}
          style={StyleSheet.styles.discoveryCenter.leftContainer}
        />
        <Chart.DropdownButton
          image={require('../Images/chart-icn-bar-yaxis.png')}
          onPress={() => props.onPressAxis(axisItemsURL({title: "Choose Y Axis", axis: 'yAxis'}))}
          title={yAxisTitle}
          style={StyleSheet.styles.discoveryCenter.rightContainer}
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
