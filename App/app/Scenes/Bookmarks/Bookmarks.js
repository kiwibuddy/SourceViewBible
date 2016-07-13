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

import { NavigationBar, Toolbar, ToolbarButton } from '../../Components/Navigation';

// $FlowFixMe: - Flow can't find os module extension
import SegmentedControl from '../../Components/Common/SegmentedControl';

type Props = {
  onPressDone: Function,
  onPressRoute: Function,
};

type State = {
  dataSource: any,
};

export default class Bookmarks extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: dataSource.cloneWithRows(this._getRows()),
    }
  }

  _getRows = () => {
    return (
      [
        '/DiscoveryCenter',
        '/Sources',
        '/Sources/Books',
        '/Sources/Conversations',
        '/Sources/Spheres',
        '/Sources/Words',
        '/Spheres',
        '/Spheres/Overview',
        '/Spheres/Books',
        '/Spheres/Passages',
        '/Spheres/Sources',
        '/Spheres/Words'
      ]
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar>
          <SegmentedControl
            style={{flex: 1}}
            tintColor={Colors.tintColor}
            values={['History', 'Bookmarks', 'Highlights']}
            selectedIndex={1}
            onValueChange={(value) => {}}
          />
          <TouchableOpacity
            hitSlop={{top: 10, bottom: 10}}
            onPress={this.props.onPressDone}
          >
            <Text style={styles.doneButtonTitle}>{Localizable.t('done')}</Text>
          </TouchableOpacity>
        </NavigationBar>
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
        onPress={() => this.props.onPressRoute({key: rowData, title: rowData})}
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
    marginTop: NavigationBar.HEIGHT,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor: 'white',
  },
  doneButtonTitle: {
    color: Colors.tintColor,
    marginLeft: 16
  },
});
