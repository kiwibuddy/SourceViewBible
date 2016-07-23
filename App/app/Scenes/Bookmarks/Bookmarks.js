/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Image,
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

import { History, Preference } from '../../Preferences';

const SEGMENTS = [Localizable.t('history'), Localizable.t('bookmarks'), Localizable.t('highlights')];
const SEGMENT_INDEXES = {
  HISTORY: 0,
  BOOKMARKS: 1,
  HIGHLIGHTS: 2,
};
const SEGMENT_PREFERENCE = Preference.Keys.Bookmarks.SegmentIndex;

type Props = {
  onPressDone: Function,
  onPressRoute: Function,
};

type State = {
  dataSource: any,
  selectedSegmentIndex: number
};

export default class Bookmarks extends Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let selectedSegmentIndex = Preference.numberForKey(SEGMENT_PREFERENCE);
    if (selectedSegmentIndex == null) selectedSegmentIndex = SEGMENT_INDEXES.BOOKMARKS;
    
    this.state = {
      dataSource: dataSource.cloneWithRows(this._getRows()),
      selectedSegmentIndex
    }
  }

  _getRows = () => {
    return (
      [
        {key: '/Discover', title: 'Discover', icon: require('../../Images/tabs/discover.png')},
        {key: '/Books', title: 'Books', icon: require('../../Images/tabs/chapters.png')},
        {key: '/Sources', title: 'Sources', icon: require('../../Images/tabs/sources.png')},
        {key: '/Spheres', title: 'Spheres', icon: require('../../Images/tabs/spheres.png')},
      ]
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar>
          <SegmentedControl
            style={{flex: 1}}
            tintColor={Colors.tint}
            values={SEGMENTS}
            selectedIndex={this.state.selectedSegmentIndex}
            onValueChange={(value) => this._onSegmentedControlValueChanged(SEGMENTS.indexOf(value))}
          />
          <TouchableOpacity
            onPress={this.props.onPressDone}
          >
            <Text style={[StyleSheet.styles.navigationBar.doneButtonTitle, {marginLeft: 16}]}>{Localizable.t('done')}</Text>
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
        <Image source={route.icon} style={styles.icon} />
        <Text style={StyleSheet.styles.cell.title}>{route.title}</Text>
      </TouchableOpacity>
    )
  };

  _onSegmentedControlValueChanged = (value: number) => {
    Preference.setNumberForKey(value, SEGMENT_PREFERENCE);

    this.setState({
      selectedSegmentIndex: value
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listView: {
    flex: 1,
    marginTop: NavigationBar.HEIGHT,
    marginLeft: 15
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  icon: {
    tintColor: Colors.tint,
    marginRight: 10,
  },
});
