/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Image,
  View,
} from 'react-native';

import {
  StyleSheet,
} from '../../../Common';

import Chart from './Chart';

type Props = {
  onPressChartType: Function,
};

const ChartBlankslate = (props: Props) => {
  return (
    <Chart>
      <View style={{alignItems: 'center'}}>
        <Image source={require('../Images/chart-pie-blankslate.png')} />
      </View>
      <Chart.Header style={{paddingLeft: 10}}>
        <Chart.Button title="PIE CHART" style={{color: '#FFFFFF'}} onPress={() => props.onPressChartType(Chart.Type.PIE)}/>
        <Chart.Button title="BAR CHART" style={{color: '#FFFFFF'}} onPress={() => props.onPressChartType(Chart.Type.BAR)} />
        <Chart.Button title="CLOUD" style={{color: '#FFFFFF'}} onPress={() => props.onPressChartType(Chart.Type.CLOUD)}/>
      </Chart.Header>
      <Chart.Footer />
    </Chart>
  );
};

export default ChartBlankslate;
