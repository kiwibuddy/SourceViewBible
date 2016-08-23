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
import PieChartMultiple from './PieChartMultiple';

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
  const occurrenceCount = card.occurrenceCount;
  const filterCount = card.filters.length;
  const xAxis = card.xAxis;
  const yAxis = card.yAxis;
  const zAxis = card.zAxis;

  let xAxisTitle = "Show...";
  if (card.xAxis) {
    const actantType = card.xAxis.actantType;
    const actantTypeKey = (actantType ? `${actantType}-` : '');
    xAxisTitle = Localizable.t(`xAxis-${actantTypeKey}${card.xAxis.type}`);
  }

  let yAxisTitle = "By...";
  if (card.yAxis) {
    const actantType = card.yAxis.actantType;
    const actantTypeKey = (actantType ? `${actantType}-` : '');
    yAxisTitle = Localizable.t(`yAxis-${actantTypeKey}${card.yAxis.type}`);
  }

  let zAxisTitle = 'Across...';
  if (zAxis) {
    const actantType = card.zAxis.actantType;
    const actantTypeKey = (actantType ? `${actantType}-` : '');
    zAxisTitle = Localizable.t(`zAxis-${actantTypeKey}${card.zAxis.type}`);
  }

  let chart = null;
  if (!xAxis || !yAxis || occurrenceCount == 0 || data == null || loading) {
    chart = <Image style={{alignSelf: 'center'}} source={require('../Images/chart-pie-blankslate.png')} />;
  } else if (zAxis) {
    chart = <PieChartMultiple key="pie-chart-multiple" {...props} />;
  } else {
    chart = <PieChartSingle key="pie-chart-single" {...props} />;
  }

  return (
    <Chart>
      {chart}
      <Chart.Header>
        <Chart.DropdownButton
          image={require('../Images/chart-icn-pie-slices.png')}
          onPress={() => props.onPressAxis(axisItemsURL({title: 'Slices', axis: 'xAxis'}))}
          style={StyleSheet.styles.discoveryCenter.leftContainer}
          title={xAxisTitle}
        />
        <Chart.DropdownButton
          image={require('../Images/chart-icn-pie-slice-value.png')}
          // onPress={() => props.onPressAxis(axisItemsURL({title: 'Slice', axis: 'yAxis'}))}
          style={StyleSheet.styles.discoveryCenter.leftContainer}
          title={yAxisTitle}
        />
        <Chart.DropdownButton
          image={require('../Images/chart-icn-pies.png')}
          onPress={() => props.onPressAxis(axisItemsURL({title: 'Pies', axis: 'zAxis'}))}
          style={StyleSheet.styles.discoveryCenter.rightContainer}
          title={zAxisTitle}
        />
      </Chart.Header>
      <Chart.Footer>
        <View style={[StyleSheet.styles.discoveryCenter.leftContainer, {justifyContent: 'flex-start', paddingLeft: 5, borderRightWidth: 0}]}>
          <TouchableOpacity onPress={() => props.onPressChartType(Chart.Type.PIE)}>
            <Image source={require('../Images/chart-type-pie-s.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.onPressChartType(Chart.Type.BAR)}>
            <Image source={require('../Images/chart-type-bar.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.onPressChartType(Chart.Type.CLOUD)}>
            <Image source={require('../Images/chart-type-cloud.png')} />
          </TouchableOpacity>
        </View>
        <View style={[StyleSheet.styles.discoveryCenter.rightContainer, {justifyContent: 'flex-end', paddingRight: -10}]}>
          <TouchableOpacity>
          </TouchableOpacity>
        </View>
      </Chart.Footer>
    </Chart>
  );
};

export default PieChartView;
