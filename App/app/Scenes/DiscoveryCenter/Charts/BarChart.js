/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Image,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../../Common';

import Chart from './Chart';
import { BarChart } from '../../../Components/Charts';

import { axisItemsURL } from '../../../Navigation';

function renderChart(card) {
  const statementCount = card.statements.length;
  const filterCount = card.filters.length;
  if (filterCount== 0 && statementCount == 0) return <Image source={require('../Images/chart-bar-blankslate.png')} />;

  return (
    <BarChart
      bars={[{color: Colors.tint, value: 50}]}
      deltaStyle={{backgroundColor: Colors.lightTint}}
      maxChartValue={100}
      style={styles.chart}
    />
  );
}

type Props = {
  card: Object,
  onPressAxis: Function,
  onPressChartType: Function,
};

const BarChartView = (props: Props) => {
  const { card } = props;

  let xAxisTitle = "Choose X Axis";
  if (props.card.xAxis) {
    xAxisTitle = props.card.xAxis.name;
  }

  let yAxisTitle = "Choose Y Axis";
  if (props.card.yAxis) {
    yAxisTitle = props.card.yAxis.name;
  }

  const chart = renderChart(card);

  return (
    <Chart>
      <View style={StyleSheet.styles.discoveryCenter.chartContainer}>
        {chart}
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

const styles = StyleSheet.create({
  chart: {
    flex: 1,
    backgroundColor: 'red',
    height: 260,
  },
});

export default BarChartView;
