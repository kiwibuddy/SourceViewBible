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

import { valuesForCard } from './ChartUtils';

type Props = {
  card: Object,
  onPressAxis: Function,
  onPressChartType: Function,
};

type State = {
  bars: any,
};

class BarChartView extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {bars: null};
  }

  componentDidMount() {
    this._valuesForCard(this.props.card);
  }

  componentWillReceiveProps(nextProps: Props) {
    this._valuesForCard(nextProps.card);
  }

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
    const {bars} = this.state
    if (!this._shouldRenderChart(this.props.card) || bars == null) return <Image source={require('../Images/chart-bar-blankslate.png')} />;

    return (
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.chart}>
        <BarChart
          bars={bars}
          barColor="rgba(0,0,0,.4)"
          barStyle={{flex: 0, width: 8, marginHorizontal: 6, marginBottom: 100,}}
          deltaStyle={{backgroundColor: 'transparent'}}
          horizontal={false}
        />
      </ScrollView>
    );
  };

  _valuesForCard = (card) => {
    if (this._shouldRenderChart(card)) {
      valuesForCard(card).then(values => this.setState({bars: values}));
    }
  }
}

const styles = StyleSheet.create({
  chart: {
    flex: 1,
    minHeight: 295,
    paddingTop: 55,
    paddingBottom: 44,
    paddingHorizontal: 8,
  },
});

export default BarChartView;
