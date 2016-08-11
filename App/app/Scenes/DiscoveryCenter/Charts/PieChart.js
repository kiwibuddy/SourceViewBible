/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Image,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Localizable,
  StyleSheet,
} from '../../../Common';

import Chart from './Chart';
import PieChartSingle from './PieChartSingle';

import { axisItemsURL } from '../../../Navigation';

type Props = {
  card: Object,
  data: Object,
  loading: boolean,
  onPressAxis: Function,
  onPressChartType: Function,
};

const PieChartView = (props: Props) => {
  const { card, data, loading } = props;
  const statements = card.statements;
  const statementCount = statements.length;
  const filterCount = card.filters.length;
  const xAxis = card.xAxis;
  const yAxis = card.yAxis;

  let xAxisTitle = "Slices";
  if (card.xAxis) {
    xAxisTitle = card.xAxis.name;
  }

  let yAxisTitle = "Slice";
  if (card.yAxis) {
    yAxisTitle = card.yAxis.name;
  }

  let chart = null;
  if (!xAxis || !yAxis || statementCount == 0 || data == null || loading) {
    chart = <Image style={{alignSelf: 'center'}} source={require('../Images/chart-pie-blankslate.png')} />;
  } else {
    chart = <PieChartSingle {...props} />;
  }

  return (
    <Chart>
      {chart}
      <Chart.Header>
        <Chart.DropdownButton
          image={require('../Images/chart-icn-pie-slices.png')}
          onPress={() => props.onPressAxis(axisItemsURL({title: "Slices", axis: 'xAxis'}))}
          title={xAxisTitle}
          style={StyleSheet.styles.discoveryCenter.leftContainer}
        />
        <Chart.DropdownButton
          image={require('../Images/chart-icn-pie-slice-value.png')}
          onPress={() => props.onPressAxis(axisItemsURL({title: "Slice", axis: 'yAxis'}))}
          title={yAxisTitle}
          style={StyleSheet.styles.discoveryCenter.leftContainer}
        />
        <Chart.DropdownButton
          image={require('../Images/chart-icn-pies.png')}
          title="Pies (optional)"
          style={StyleSheet.styles.discoveryCenter.rightContainer}
        />
      </Chart.Header>
      <Chart.Footer>
        <View style={[StyleSheet.styles.discoveryCenter.leftContainer, {justifyContent: 'flex-start', paddingLeft: 5, borderRightWidth: 0}]}>
          <TouchableOpacity onPress={() => props.onPressChartType(Chart.Type.BAR)}>
            <Image source={require('../Images/chart-type-bar.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.onPressChartType(Chart.Type.PIE)}>
            <Image source={require('../Images/chart-type-pie-s.png')} />
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

export default PieChartView;
