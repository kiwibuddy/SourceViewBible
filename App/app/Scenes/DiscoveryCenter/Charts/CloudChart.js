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

const CloudChart = (props: Object) => {
  return (
    <Chart>
      <Image source={require('../Images/chart-blankslate.png')} />
      <Chart.Header>
        <Chart.DropdownButton
          image={require('../Images/chart-icn-word-yaxis.png')}
          title="Choose Text"
          style={StyleSheet.styles.discoveryCenter.leftContainer}
        />
        <Chart.DropdownButton
          image={require('../Images/chart-icn-word-xaxis.png')}
          title="Choose Size"
          style={StyleSheet.styles.discoveryCenter.rightContainer}
        />
      </Chart.Header>
      <Chart.Footer>
        <View style={[StyleSheet.styles.discoveryCenter.leftContainer, {justifyContent: 'flex-start', paddingLeft: 5, borderRightWidth: 0}]}>
          <TouchableOpacity>
            <Image source={require('../Images/chart-type-bar.png')} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../Images/chart-type-pie.png')} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../Images/chart-type-cloud-s.png')} />
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

export default CloudChart;
