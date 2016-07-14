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
        {key: '/Discover', title: 'Discover'},
        {key: '/Books', title: 'Books'},
        {key: '/Spheres', title: 'Spheres'},
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
            onPress={this.props.onPressDone}
          >
            <Text style={StyleSheet.styles.navigationBar.doneButtonTitle}>{Localizable.t('done')}</Text>
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

  _renderRow = (route: Object) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.onPressRoute(route)}
        style={styles.row}
      >
        <Text>{route.title}</Text>
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
});
