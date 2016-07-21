/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Image,
} from 'react-native';

import Chart from './Chart';

const ChartBlankslate = (props: Object) => {
  return (
    <Chart>
      <Image source={require('../../Images/discoverycenter/chart-blankslate.png')} />
      <Chart.Header style={{paddingLeft: 10}}>
        <Chart.Button title="BAR CHART" style={{color: '#FFFFFF'}} />
        <Chart.Button title="PIE CHART" style={{color: '#FFFFFF'}} />
        <Chart.Button title="CLOUD" style={{color: '#FFFFFF'}} />
      </Chart.Header>
      <Chart.Footer />
    </Chart>
  );
};

export default ChartBlankslate;
