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
import { BarChart } from '../../../Components/Charts';

import { axisItemsURL } from '../../../Navigation';

import { Statement } from '../../../Database';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function renderChart(card) {
  const statements = card.statements;
  const statementCount = statements.length;
  const filterCount = card.filters.length;
  const xAxis = card.xAxis;
  const yAxis = card.yAxis;
  if (!xAxis || !yAxis || (filterCount== 0 && statementCount == 0)) return <Image source={require('../Images/chart-bar-blankslate.png')} />;

  const values = {};
  statements.forEach(occurrence => {
    const statement = Statement.findByID(occurrence.id);
    const actant = statement.source;
    if (actant) {
      actant.professions.forEach(profession => {
        const wordCount = values[profession.name] || 0;
        values[profession.name] = wordCount + statement.wordCount;
      });
    }
  });

  const bars = Object.keys(values).sort((a,b) => values[a] > values[b] ? -1 : 1).slice(0, 20).map(key => ({key, color: 'red', value:values[key]}));

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.chart}>
      <BarChart
        bars={bars}
        barStyle={{flex: 0, width: 8, marginHorizontal: 2}}
        deltaStyle={{backgroundColor: 'transparent'}}
        horizontal={false}
        maxChartValue={100}
      />
    </ScrollView>
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
    height: 295,
    paddingTop: 44,
    paddingBottom: 120,
  },
});

export default BarChartView;
