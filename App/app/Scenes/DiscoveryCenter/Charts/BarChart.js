/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';

import {
  ActivityIndicator,
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

type Props = {
  card: Object,
  data: Object,
  loading: boolean,
  onPressAxis: Function,
  onPressChartType: Function,
};

class BarChartView extends Component {
  props: Props;

  render() {
    const { card } = this.props;

    let xAxisTitle = "Choose X Axis";
    if (card.xAxis) {
      xAxisTitle = card.xAxis.name;
    }

    let yAxisTitle = "Choose Y Axis";
    if (card.yAxis) {
      yAxisTitle = card.yAxis.name;
    }

    const chart = this._renderChart();

    const loading = (this.props.loading ? <ActivityIndicator color="white" size="large" style={styles.activityIndicator} /> : null);

    return (
      <Chart>
        <View style={StyleSheet.styles.discoveryCenter.chartContainer}>
          {chart}
        </View>
        <Chart.Header>
          <Chart.DropdownButton
            image={require('../Images/chart-icn-bar-xaxis.png')}
            onPress={() => this.props.onPressAxis(axisItemsURL({title: "Choose X Axis", axis: 'xAxis'}))}
            title={xAxisTitle}
            style={StyleSheet.styles.discoveryCenter.leftContainer}
          />
          <Chart.DropdownButton
            image={require('../Images/chart-icn-bar-yaxis.png')}
            onPress={() => this.props.onPressAxis(axisItemsURL({title: "Choose Y Axis", axis: 'yAxis'}))}
            title={yAxisTitle}
            style={StyleSheet.styles.discoveryCenter.rightContainer}
          />
        </Chart.Header>
        <Chart.Footer>
          <View style={[StyleSheet.styles.discoveryCenter.leftContainer, {justifyContent: 'flex-start', paddingLeft: 5, borderRightWidth: 0}]}>
            <TouchableOpacity onPress={() => this.props.onPressChartType(Chart.Type.BAR)}>
              <Image source={require('../Images/chart-type-bar-s.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.onPressChartType(Chart.Type.PIE)}>
              <Image source={require('../Images/chart-type-pie.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.onPressChartType(Chart.Type.CLOUD)}>
              <Image source={require('../Images/chart-type-cloud.png')} />
            </TouchableOpacity>
          </View>
          <View style={[StyleSheet.styles.discoveryCenter.rightContainer, {justifyContent: 'flex-end', paddingRight: -10}]}>
            <TouchableOpacity>
              <Image source={require('../Images/btn-fullscreen.png')} />
            </TouchableOpacity>
          </View>
        </Chart.Footer>
        {loading}
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
    const {data} = this.props
    if (!this._shouldRenderChart(this.props.card) || data == null || this.props.loading) return <Image source={require('../Images/chart-bar-blankslate.png')} />;

    return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.chart}>
        <BarChart
          bars={data}
          barColor="#F74260"
          barStyle={{flex: 0, width: 8, marginHorizontal: 6, marginBottom: 100,}}
          deltaStyle={{backgroundColor: 'transparent'}}
          horizontal={false}
        />
      </ScrollView>
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
});

export default BarChartView;
