/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  ListView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

type State = {
  dataSource: any,
};

export default class Bookmarks extends Component {
  state: State;

  constructor(props: any) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: dataSource.cloneWithRows(this._getRows()),
    }
  }

  _getRows = () => {
    return (
      [
        '/Books',
        '/Books/Sources',
        '/Books/Spheres',
        '/Books/Words',
        '/Discover',
        '/DiscoveryCenter',
        '/Reader',
        '/Sources',
        '/Sources/Overview',
        '/Sources/Books',
        '/Sources/Conversations',
        '/Sources/Spheres',
        '/Sources/Words',
        '/Spheres',
        '/Spheres/Overview',
        '/Spheres/Books',
        '/Spheres/Sources',
        '/Spheres/Words'
      ]
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={StyleSheet.styles.separator} />}
          style={styles.listView}
        />
      </View>
    );
  }

  _renderRow = (rowData: any) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.onPress({key: rowData})}
        style={styles.row}
      >
        <Text>{rowData}</Text>
      </TouchableOpacity>
    )
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listView: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor: 'white',
  },
});
