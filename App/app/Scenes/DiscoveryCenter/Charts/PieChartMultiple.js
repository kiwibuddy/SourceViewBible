/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  ListView,
  RecyclerViewBackedScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  Colors,
  Constants,
  StyleSheet,
  Localizable
} from '../../../Common';

import PieColors, { DeltaColor, colorAtIndex } from './PieChartColors';
import PieChartList from './PieChartList';
import { PieChart } from '../../../Components/Charts';

type Props = {
  card: Object,
  data: Object,
};

type State = {
  dataSource: any
};

export default class PieChartMultiple extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = {
      dataSource: dataSource,
    };
  }

  render() {
    const { data } = this.props;

    const dataSource = this.state.dataSource.cloneWithRows(data.slice(0, Math.min(data.length, 10)));

    return (
      <View style={[styles.container, this.props.style]}>
        <ListView
          dataSource={dataSource}
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

  _renderChart = (pie: Object, sectionID: any, rowID: any) => {
    const { data } = this.props;
    const slices = data.slice(0, Math.min(data.length, 10)).map((slice, index) => ({...slice, color: PieColors[index]}));

    const totalValue = data.reduce((sum, slice) => sum + slice.value, 0);
    const totalSlices = slices.reduce((sum, slice) => sum + slice.value, 0);
    const deltaValue = totalValue - totalSlices;
    if (deltaValue > 0) {
      slices.push({color: DeltaColor, value: deltaValue})
    }

    return (
      <View style={styles.chart}>
        <PieChartList
          {...this.props}
          style={styles.pieList}
          renderHeader={() => {
            return (
              <PieChart
                color="white"
                slices={slices}
                sliceWidth={6}
                size={100}
                style={styles.pie}
                title='Some really long text'
                titleStyle={{marginHorizontal: 6}}
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
    marginVertical: 10,
    backgroundColor: 'red',
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
