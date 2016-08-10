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

class CloudChartView extends Component {
  props: Props;

  render() {
    const { card } = this.props;

    let xAxisTitle = "Choose Text";
    if (card.xAxis) {
      xAxisTitle = card.xAxis.name;
    }

    let yAxisTitle = "Choose Size";
    if (card.yAxis) {
      yAxisTitle = card.yAxis.name;
    }

    const chart = this._renderChart();

    return (
      <Chart>
        <View style={StyleSheet.styles.discoveryCenter.chartContainer}>
          {chart}
        </View>
        <Chart.Header>
          <Chart.DropdownButton
            image={require('../Images/chart-icn-bar-xaxis.png')}
            onPress={() => this.props.onPressAxis(axisItemsURL({title: "Choose Text", axis: 'xAxis'}))}
            title={xAxisTitle}
            style={StyleSheet.styles.discoveryCenter.leftContainer}
          />
          <Chart.DropdownButton
            image={require('../Images/chart-icn-bar-yaxis.png')}
            onPress={() => this.props.onPressAxis(axisItemsURL({title: "Choose Size", axis: 'yAxis'}))}
            title={yAxisTitle}
            style={StyleSheet.styles.discoveryCenter.rightContainer}
          />
        </Chart.Header>
        <Chart.Footer>
          <View style={[StyleSheet.styles.discoveryCenter.leftContainer, {justifyContent: 'flex-start', paddingLeft: 5, borderRightWidth: 0}]}>
            <TouchableOpacity onPress={() => this.props.onPressChartType(Chart.Type.BAR)}>
              <Image source={require('../Images/chart-type-bar.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.onPressChartType(Chart.Type.PIE)}>
              <Image source={require('../Images/chart-type-pie.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.onPressChartType(Chart.Type.CLOUD)}>
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
  }

  _shouldRenderChart = (card): boolean => {
    const statements = card.statements;
    const statementCount = statements.length;
    const filterCount = card.filters.length;
    const xAxis = card.xAxis;
    const yAxis = card.yAxis;
    return (xAxis && yAxis && statementCount > 0);
  };

  _renderChart = () => {
    const { data } = this.props;
    if (!this._shouldRenderChart(this.props.card) || data == null || this.props.loading) return <Image source={require('../Images/chart-cloud-blankslate.png')} />;

    const words = data.slice(0, Math.min(data.length, 15)).map(word => word.label);

    return (
      <WordCloud style={[StyleSheet.styles.wordCloud, styles.chart]}>
        <ParallaxMotionView intensity={5} style={[styles.parallax, {opacity: 0.8}]}>
          <Text style={[styles.wc1, {top: 50, alignSelf: 'center'}]}>{words[0]}</Text>
        </ParallaxMotionView>
        <ParallaxMotionView intensity={10} style={[styles.parallax, {opacity: 0.8}]}>
          <Text style={[styles.wc2, {top: 125, right: 15}]}>{words[1]}</Text>
          <Text style={[styles.wc2, {top: 150, left: 15}]}>{words[2]}</Text>
          <Text style={[styles.wc2, {top: -15, left: -10}]}>{words[3]}</Text>
          <Text style={[styles.wc2, {top: -20, right: 40}]}>{words[4]}</Text>
        </ParallaxMotionView>
        <ParallaxMotionView intensity={20} style={[styles.parallax, {opacity: 0.6}]}>
          <Text style={[styles.wc3, {top: 90, right: 10}]}>{words[5]}</Text>
          <Text style={[styles.wc3, {top: 55, left: 10}]}>{words[6]}</Text>
          <Text style={[styles.wc3, {top: 30, right: -10}]}>{words[7]}</Text>
          <Text style={[styles.wc3, {top: 125, left: 30}]}>{words[8]}</Text>
        </ParallaxMotionView>
        <ParallaxMotionView intensity={30} style={[styles.parallax, {opacity: 0.3}]}>
          <Text style={[styles.wc4, {top: 20, right: 150}]}>{words[9]}</Text>
          <Text style={[styles.wc4, {top: 150, right: 170}]}>{words[10]}</Text>
          <Text style={[styles.wc4, {top: 35, left: 80}]}>{words[11]}</Text>
          <Text style={[styles.wc4, {top: 100, left: -10}]}>{words[12]}</Text>
          <Text style={[styles.wc4, {top: -10, left: 130}]}>{words[13]}</Text>
          <Text style={[styles.wc4, {top: 65, right: 60}]}>{words[14]}</Text>
        </ParallaxMotionView>
      </WordCloud>
    );
  };
}

const styles = StyleSheet.create({
  chart: {
    flex: 1,
    minHeight: 295,
    paddingTop: 55,
    paddingBottom: 44,
    paddingHorizontal: 8,
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
    fontSize: 18,
    fontWeight: '200',
    position: 'absolute',
  },
});

export default CloudChartView;
