/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  ListView,
  Text,
  TouchableHighlight,
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
        '/Books/BookChapters',
        '/Books/BookOverview'
      ]
    )
  };

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          style={styles.listView}
        />
      </View>
    );
  }

  _renderRow = (rowData: any) => {
    return (
      <TouchableHighlight
        onPress={(rowData) => this.props.onPress({key: rowData})}
        style={styles.row}
        underlayColor="transparent"
      >
        <Text>{rowData}</Text>
      </TouchableHighlight>
    )
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listView: {
    flex: 1,
    marginTop: 64,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#CCCCCC',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor: 'white',
  },
});
