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

import PieColors, { colorAtIndex } from './ChartColors';

type Props = {
  card: Object,
  data: Object,
  renderHeader?: Function,
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
    const slices = data.map((slice, index) => ({...slice, color: slice.color || colorAtIndex(index), percent: (slice.value / totalValue) * 100}));
    const dataSource = this.state.dataSource.cloneWithRows(slices);

    return (
      <View style={[styles.container, this.props.style]}>
        <ListView
          dataSource={dataSource}
          renderHeader={this.props.renderHeader}
          renderRow={this._renderRow}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          style={styles.listView}
        />
      </View>
    );
  }

  _renderRow = (slice: Object, sectionID: any, rowID: any) => {
    return (
      <View style={styles.row}>
        <View style={[styles.dot, {backgroundColor: slice.color}]} />
        <Text style={styles.percentText}>{Localizable.toPercentage(slice.percent, {precision: 0})}</Text>
        <Text numberOfLines={1} style={[styles.labelText, this.props.labelStyle]}>{slice.label}</Text>
      </View>
    );
  };
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listView: {
    flex: 1.5,
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    height: 20,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    marginRight: 8,
  },
  percentText: {
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 4,
  },
  labelText: {
    backgroundColor: 'transparent',
    color: 'rgba(255,255,255,.75)',
  },
});
