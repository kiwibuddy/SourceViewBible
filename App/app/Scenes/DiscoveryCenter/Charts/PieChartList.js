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

import PieColors, { colorAtIndex } from './PieChartColors';

type Props = {
  card: Object,
  data: Object,
};

type State = {
  dataSource: any
};

export default class PieChartList extends Component {
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
    const totalValue = data.reduce((sum, slice) => sum + slice.value, 0);
    const slices = data.map((slice, index) => ({...slice, color: colorAtIndex(index), percent: (slice.value / totalValue) * 100}));
    const dataSource = this.state.dataSource.cloneWithRows(slices);

    return (
      <View style={[styles.container, this.props.style]}>
        <ListView
          dataSource={dataSource}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
        />
      </View>
    );
  }

  _renderRow = (slice: Object, sectionID: any, rowID: any) => {
    return (
      <View style={styles.row}>
        <View style={[styles.dot, {backgroundColor: slice.color}]} />
        <Text style={styles.percentText}>{Localizable.toPercentage(slice.percent, {precision: 0})}</Text>
        <Text style={styles.titleText}>{slice.label}</Text>
      </View>
    );
  };
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row'
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  percentText: {
    backgroundColor: 'transparent',
  },
  titleText: {
    backgroundColor: 'transparent',
  },
});
