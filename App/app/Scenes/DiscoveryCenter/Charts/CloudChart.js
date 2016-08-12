/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Colors,
  Localizable,
  StyleSheet,
} from '../../../Common';

import Chart from './Chart';
import { WordCloud } from '../../../Components/Charts';
import ParallaxMotionView from '../../../Components/Common/ParallaxMotionView';

import { axisItemsURL } from '../../../Navigation';

type Props = {
  card: Object,
  data: Object,
  loading: boolean,
  onPressAxis: Function,
  onPressChartType: Function,
};

const CloudChartView = (props: Props) => {
  const { card, data, loading } = props;
  const statements = card.statements;
  const statementCount = statements.length;
  const filterCount = card.filters.length;
  const xAxis = card.xAxis;
  const yAxis = card.yAxis;

  let xAxisTitle = "Choose Text";
  if (card.xAxis) {
    xAxisTitle = card.xAxis.name;
  }

  let yAxisTitle = "Choose Size";
  if (card.yAxis) {
    yAxisTitle = card.yAxis.name;
  }

  let chart = null;
  if (!xAxis || !yAxis || statementCount == 0 || data == null || loading) {
    chart = <Image style={{alignSelf: 'center'}} source={require('../Images/chart-cloud-blankslate.png')} />;
  } else {
    const words = data.slice(0, Math.min(data.length, 10)).map(word => word.label);
    chart = <WordCloud style={styles.chart}>
      <ParallaxMotionView intensity={5} style={[styles.parallax, {opacity: 0.8}]}>
        <Text style={[styles.wc1, {top: 50, alignSelf: 'center'}]} numberOfLines={1}>{words[0]}</Text>
      </ParallaxMotionView>
      <ParallaxMotionView intensity={10} style={[styles.parallax, {opacity: 0.8}]}>
        <Text style={[styles.wc2, {top: 10, left: -5}]}>{words[1]}</Text>
        <Text style={[styles.wc2, {bottom: 20, right: 15}]}>{words[2]}</Text>
        <Text style={[styles.wc2, {top: -5, right: 50}]}>{words[3]}</Text>
        <Text style={[styles.wc2, {bottom: 0, left: 50}]}>{words[4]}</Text>
      </ParallaxMotionView>
      <ParallaxMotionView intensity={20} style={[styles.parallax, {opacity: 0.6}]}>
        <Text style={[styles.wc3, {top: 40, right: 15}]}>{words[5]}</Text>
        <Text style={[styles.wc3, {top: 120, left: 0}]}>{words[6]}</Text>
        <Text style={[styles.wc3, {top: 60, left: 35}]}>{words[7]}</Text>
        <Text style={[styles.wc3, {bottom: 70, right: 35}]}>{words[8]}</Text>
        <Text style={[styles.wc3, {bottom: 10, right: 120}]}>{words[9]}</Text>
      </ParallaxMotionView>
    </WordCloud>
  }

  return (
    <Chart>
      {chart}
      <Chart.Header>
        <Chart.DropdownButton
          image={require('../Images/chart-icn-word-xaxis.png')}
          onPress={() => props.onPressAxis(axisItemsURL({title: "Choose Text", axis: 'xAxis'}))}
          title={xAxisTitle}
          style={StyleSheet.styles.discoveryCenter.leftContainer}
        />
        <Chart.DropdownButton
          image={require('../Images/chart-icn-word-yaxis.png')}
          onPress={() => props.onPressAxis(axisItemsURL({title: "Choose Size", axis: 'yAxis'}))}
          title={yAxisTitle}
          style={StyleSheet.styles.discoveryCenter.rightContainer}
        />
      </Chart.Header>
      <Chart.Footer>
        <View style={[StyleSheet.styles.discoveryCenter.leftContainer, {justifyContent: 'flex-start', paddingLeft: 5, borderRightWidth: 0}]}>
          <TouchableOpacity onPress={() => props.onPressChartType(Chart.Type.BAR)}>
            <Image source={require('../Images/chart-type-bar.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.onPressChartType(Chart.Type.PIE)}>
            <Image source={require('../Images/chart-type-pie.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.onPressChartType(Chart.Type.CLOUD)}>
            <Image source={require('../Images/chart-type-cloud-s.png')} />
          </TouchableOpacity>
        </View>
        <Text style={styles.chartNote}>TOP 10</Text>
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
    marginVertical: 44,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  activityIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  parallax: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  wc1: {
    color: 'white',
    backgroundColor:'transparent',
    fontSize: 66,
    fontWeight: '200',
  },
  wc2: {
    color: 'white',
    backgroundColor:'transparent',
    fontSize: 42,
    fontWeight: '200',
    position: 'absolute',
  },
  wc3: {
    color: 'white',
    backgroundColor:'transparent',
    fontSize: 30,
    fontWeight: '200',
    position: 'absolute',
  },
  wc4: {
    color: 'white',
    backgroundColor:'transparent',
    fontSize: 11,
    fontWeight: '200',
    position: 'absolute',
  },
  chartNote: {
    color: 'rgba(255,255,255,.5)',
    fontSize: 11,
    backgroundColor: 'transparent',
  }
});

export default CloudChartView;
