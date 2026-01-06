/* @flow */
'use strict';

import React, { Component } from 'react';

import { ListView, View } from 'react-native';

import { StyleSheet } from '../../../Common';

import ChartColors from './ChartColors';
import PieChartList from './PieChartList';
import { PieChart } from '../../../Components/Charts';

type Props = {
  card: Object,
  data: Object,
  style?: Object,
};

type State = {
  dataSource: any,
};

export default class PieChartMultiple extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const { data } = this.props;
    const dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id });
    this.state = {
      dataSource: dataSource.cloneWithRows(data.slice(0, Math.min(data.length, 100))),
    };
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <ListView
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          horizontal={true}
          renderRow={this._renderChart}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          showsHorizontalScrollIndicator={false}
          style={styles.listView}
        />
      </View>
    );
  }

  _renderChart = (pie: Object) => {
    const data = pie.value;
    if (!Array.isArray(data)) return null;

    const totalValue = data.reduce((sum, slice) => sum + slice.value, 0);
    const slices = data.filter(slice => (slice.value / totalValue) * 100 >= 1).map((slice, index) => {
      return { ...slice, color: slice.color || ChartColors.colorAtIndex(index) };
    });

    return (
      <View style={styles.chart}>
        <PieChartList
          card={this.props.card}
          data={data}
          style={styles.pieList}
          renderHeader={() => {
            return (
              <PieChart
                color="white"
                slices={slices}
                size={100}
                style={styles.pie}
                title={pie.label}
                titleStyle={{ marginHorizontal: 11, fontSize: 13, fontWeight: 'bold' }}
              />
            );
          }}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 44,
  },
  chart: {
    flex: 1,
    width: 150,
    marginTop: 10,
  },
  listView: {
    flex: 1,
  },
  separator: {
    width: StyleSheet.hairlineWidth,
    marginVertical: 5,
    backgroundColor: 'rgba(0,0,0,.25)',
  },
  pie: {
    flex: 1,
    alignSelf: 'center',
    marginBottom: 10,
  },
  pieList: {
    flex: 1,
    height: 180,
    marginHorizontal: 10,
  },
});
