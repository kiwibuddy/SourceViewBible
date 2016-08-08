/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  AsyncStorage,
  ListView,
  Platform,
  RecyclerViewBackedScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// import { ListView } from '../../Components/Common/DatabaseListView';

import {
  Colors,
  Constants,
  StyleSheet,
  Localizable
} from '../../Common';

import { Statement } from '../../Database';

type Props = {
  navigate: Function,
  statements: Array<Statement>
};

type State = {
  dataSource: any
};

export default class DiscoveryCenterOccurrences extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = {
      dataSource: dataSource
    };
  }

  componentDidMount() {
    const { statements } = this.props;
    if (statements) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(statements)
      });
    }
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

  _renderRow = (statement: Statement, sectionID: any, rowID: any) => {
    return (
      <TouchableOpacity key={statement.id} style={StyleSheet.styles.listItem} onPress={() => this.props.onDone(filter)}>
        <Text style={StyleSheet.styles.cell.title}>Statement</Text>
      </TouchableOpacity>
    );
  };
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 8,
  },
});
