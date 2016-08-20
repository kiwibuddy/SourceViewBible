/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../../Common';

import Chart from './Chart';
import ChartColors from './ChartColors';

import { BarChart } from '../../../Components/Charts';
import { axisItemsURL } from '../../../Navigation';

type Props = {
  card: Object,
  data: Object,
  loading: boolean,
  onPressAxis: Function,
  onPressChartType: Function,
};

const BarChartView = (props: Props) => {
  const { card, loading } = props;
  const occurrenceCount = card.occurrenceCount;
  const filterCount = card.filters.length;
  const xAxis = card.xAxis;
  const yAxis = card.yAxis;
  const data = (card.zAxis && props.data ? props.data[0].value : props.data);

  let xAxisTitle = "Show...";
  if (card.xAxis) {
    xAxisTitle = card.xAxis.name;
  }

  let yAxisTitle = "By...";
  if (card.yAxis) {
    yAxisTitle = card.yAxis.name;
  }

  let chart = null;
  if (!xAxis || !yAxis || occurrenceCount == 0 || data == null || loading) {
    chart = <Image style={{alignSelf: 'center'}} source={require('../Images/chart-bar-blankslate.png')} />;
  } else {
    const bars = data.map((slice, index) => {
      return {...slice, color: "#FF3F49"};
    });

    chart = <ScrollView style={styles.chart} horizontal={true} showsHorizontalScrollIndicator={false}>
      <BarChart
        bars={bars}
        barStyle={{flex: 0, width: 8, marginHorizontal: 6, marginBottom: 100,}}
        deltaStyle={{backgroundColor: 'transparent'}}
        horizontal={false}
      />
    </ScrollView>;
  }

  return (
    <Chart>
      {chart}
      <Chart.Header>
        <Chart.DropdownButton
          image={require('../Images/chart-icn-bar-xaxis.png')}
          onPress={() => props.onPressAxis(axisItemsURL({title: "Choose X Axis", axis: 'xAxis'}))}
          title={xAxisTitle}
          style={StyleSheet.styles.discoveryCenter.leftContainer}
        />
        <Chart.DropdownButton
          image={require('../Images/chart-icn-bar-yaxis.png')}
          // onPress={() => props.onPressAxis(axisItemsURL({title: "Choose Y Axis", axis: 'yAxis'}))}
          title={yAxisTitle}
          style={StyleSheet.styles.discoveryCenter.rightContainer}
        />
      </Chart.Header>
      <Chart.Footer>
        <View style={[StyleSheet.styles.discoveryCenter.leftContainer, {justifyContent: 'flex-start', paddingLeft: 5, borderRightWidth: 0}]}>
          <TouchableOpacity onPress={() => props.onPressChartType(Chart.Type.PIE)}>
            <Image source={require('../Images/chart-type-pie.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.onPressChartType(Chart.Type.BAR)}>
            <Image source={require('../Images/chart-type-bar-s.png')} />
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

const styles = StyleSheet.create({
  chart: {
    flex: 1,
    paddingTop: 55,
    paddingBottom: 44,
    paddingHorizontal: 4,
    alignSelf: 'center',
  },
});

export default BarChartView;
