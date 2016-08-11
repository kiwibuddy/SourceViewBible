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

  componentDidMount() {

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows([1,2,3])
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
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
        <View style={styles.dot} />
        <Text style={styles.percentText}>0%</Text>
        <Text style={styles.titleText}>Foo</Text>
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
