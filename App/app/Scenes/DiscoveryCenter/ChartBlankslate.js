/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Image,
} from 'react-native';

import Chart from './Chart';

type Props = {
  onPressChartType: Function,
};

const ChartBlankslate = (props: Props) => {
  return (
    <Chart>
      <Image source={require('../../Images/discoverycenter/chart-blankslate.png')} />
      <Chart.Header style={{paddingLeft: 10}}>
        <Chart.Button title="BAR CHART" style={{color: '#FFFFFF'}} onPress={() => props.onPressChartType(Chart.Type.BAR)} />
        <Chart.Button title="PIE CHART" style={{color: '#FFFFFF'}} onPress={() => props.onPressChartType(Chart.Type.PIE)}/>
        <Chart.Button title="CLOUD" style={{color: '#FFFFFF'}} onPress={() => props.onPressChartType(Chart.Type.CLOUD)}/>
      </Chart.Header>
      <Chart.Footer />
    </Chart>
  );
};

export default ChartBlankslate;
