/* @flow */
'use strict';

import React, { Component, PropTypes } from 'react';
const ReactComponentWithPureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');

import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { ListView } from 'realm/react-native';

import {
  Colors,
  StyleSheet,
  Localizable
} from '../../Common';

import moment from 'moment';

import { NavigationHeader, NavigationBarButton, Toolbar, ToolbarButton } from '../../Components/Navigation';

import { BACK, bookmarkURL, spheresURL, sphereInAppPurchaseURL } from '../../Navigation';

// $FlowFixMe: - Flow can't find os module extension
import SegmentedControl from '../../Components/Common/SegmentedControl';

import { History, Preference } from '../../Preferences';

const SEGMENTS = [Localizable.t('history'), Localizable.t('bookmarks')];
const SEGMENT_INDEXES = {
  HISTORY: 0,
  BOOKMARKS: 1,
  HIGHLIGHTS: 2,
};
const SEGMENT_PREFERENCE = Preference.Keys.Bookmarks.SegmentIndex;

function renderBackButton(props: Object) {
  return (
    <NavigationBarButton
      title={Localizable.t('done')}
      titleStyle={StyleSheet.styles.navigationBar.doneButtonTitle}
      onPress={() => props.navigate(BACK)}
    />
  );
}

type Props = {
  navigate: Function,
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

    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id, sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
    let selectedSegmentIndex = Preference.numberForKey(SEGMENT_PREFERENCE);
    if (selectedSegmentIndex == null) selectedSegmentIndex = Platform.OS === 'android' ? SEGMENT_INDEXES.HISTORY : SEGMENT_INDEXES.BOOKMARKS;

    this.state = {
      dataSource: dataSource,
      selectedSegmentIndex
    }
  }

  componentDidMount() {
    this.setState({
      dataSource: this._getDataSource(this.state.selectedSegmentIndex)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationHeader
          navigate={this.props.navigate}
          renderTitleComponent={this._renderTitleComponent.bind(this)}
          renderLeftComponent={Platform.OS === 'android' ? renderBackButton : null}
          renderRightComponent={Platform.OS === 'ios' ? renderBackButton : null}
        />
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderSectionHeader={this._renderSectionHeader}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
          style={styles.listView}
        />
      </View>
    );
  }

  _renderTitleComponent(props: Object) {
    if (Platform.OS === 'android') {
      return <NavigationHeader.Title>{Localizable.t('history')}</NavigationHeader.Title>;
    }

    return (
      <SegmentedControl
        style={[styles.segmentedControl, {marginTop: 8}]}
        tintColor={Colors.tint}
        values={SEGMENTS}
        selectedIndex={this.state.selectedSegmentIndex}
        onValueChange={(value) => this._onSegmentedControlValueChanged(SEGMENTS.indexOf(value))}
      />
    );
  };

  _renderSectionHeader = (sectionData: Object, sectionID: any) => {
    if (this.state.selectedSegmentIndex != SEGMENT_INDEXES.HISTORY) return null;

    const title = sectionID;
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderTitle}>{title}</Text>
      </View>
    );
  };

  _renderRow = (data: Object) => {
    switch (this.state.selectedSegmentIndex) {
      case SEGMENT_INDEXES.HISTORY:
        return this._renderHistoryRow(data);

      case SEGMENT_INDEXES.HIGHLIGHTS:
        return this._renderHighlightRow(data);

      default:
        return this._renderBookmarkRow(data);
    }
  };

  _renderBookmarkRow = (bookmark: Object) => {
    const icon = this._iconForRoute(bookmark);

    return (
      <TouchableOpacity
        onPress={() => this._navigate(bookmark)}
        style={styles.row}
      >
        <Image source={icon} style={styles.icon} />
        <Text style={StyleSheet.styles.cell.title}>{bookmark.title}</Text>
      </TouchableOpacity>
    );
  }

  _renderHistoryRow = (history: Object) => {
    const icon = this._iconForRoute(history.route);

    return (
      <TouchableOpacity
        onPress={() => this._navigate(history.route)}
        style={styles.row}
      >
        <Image source={icon} style={styles.icon} />
        <Text style={StyleSheet.styles.cell.title}>{history.description || history.title}</Text>
      </TouchableOpacity>
    );
  };

  _renderHighlightRow = (history: Object) => {
    return (
      <TouchableOpacity
        onPress={() => {}}
        style={styles.row}
      >
        <Text style={StyleSheet.styles.cell.title}></Text>
      </TouchableOpacity>
    );
  };

  _navigate = (route: Object) => {
    this.props.navigate(route, {replace: true});
  };

  _getDataSource = (segmentIndex: number) => {
    switch (segmentIndex) {
      case SEGMENT_INDEXES.HISTORY:
        const { rows, sections } = this._getHistory();
        return this.state.dataSource.cloneWithRowsAndSections(rows, sections);

      case SEGMENT_INDEXES.HIGHLIGHTS:
        return this.state.dataSource.cloneWithRowsAndSections({highlights: []});

      default:
        const bookmarks = [
          {path: '/Discover', title: Localizable.t('discover')},
          {path: '/Books', title: Localizable.t('books')},
          {path: '/Sources', title: Localizable.t('sources.text')},
          {path: '/Spheres', title: Localizable.t('spheres.text')},
          {path: '/About', title: Localizable.t('about-sourceview'), modal: true}
        ];

        if (__DEV__) {
          bookmarks.push({path: '/Onboarding', title: 'Onboarding', modal: true});
          bookmarks.push(sphereInAppPurchaseURL({title: 'Spheres IAP', redirect: spheresURL({title: 'Spheres'}), modal: true}));
          bookmarks.push(bookmarkURL({title: 'Bookmark', bookmarkID: 'new', modal: true}));
        }

        return this.state.dataSource.cloneWithRowsAndSections({bookmarks: bookmarks});
    }
  };

  _getHistory = () => {
    const rows = {};
    const sections = [];

    const today = moment();

    History.all().forEach((history) => {
      const dateDiff = today.diff(history.date, 'days');
      let section = null;
      switch (dateDiff) {
        case 0:
          section = Localizable.t('today');
          break;

        case 1:
          section = Localizable.t('yesterday');
          break;

        default:
          section = Localizable.strftime(history.date, "%A, %B %-d");
      }
      if (sections.indexOf(section) === -1) {
        sections.push(section);
        rows[section] = [];
      }
      rows[section].push(history);
    });

    return {rows, sections};
  };

  _iconForRoute = (route: Object) => {
    const icons = {
      '/Discover': require('../../Images/tabs/discover.png'),
      '/Books': require('../../Images/tabs/chapters.png'),
      '/Sources': require('../../Images/tabs/sources.png'),
      '/Spheres': require('../../Images/tabs/spheres.png'),
      '/Reader': require('../../Images/tabs/chapters.png'),
      '/About': require('../../Images/tabs/about.png'),
    };

    const path = Object.keys(icons).find(path => route.path.startsWith(path));
    if (path) return icons[path];

    console.log('Cannot find icon for path:' + route.path);
    return null;
  };

  _onSegmentedControlValueChanged = (value: number) => {
    Preference.setNumberForKey(value, SEGMENT_PREFERENCE);

    this.setState({
      selectedSegmentIndex: value,
      dataSource: this._getDataSource(value)
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  listView: {
    flex: 1,
  },
  sectionHeaderTitle: {
    color: '#59626a',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 15,
  },
  icon: {
    tintColor: Colors.tint,
    marginRight: 10,
  },
  separator: {
    ...StyleSheet.styles.separator,
    marginLeft: 15,
  },
  ...Platform.select({
      ios: {
        sectionHeaderContainer: {
          paddingVertical: 4,
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#FAFAFA',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: '#c8c7cc',
        },
        segmentedControl: {
          left: -32,
          marginRight: -16,
        },
      },
      android: {
        sectionHeaderContainer: {
          paddingVertical: 4,
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        segmentedControl: {
          backgroundColor: '#F9F9F9',
          right: -32,
          marginLeft: -16,
        },
      },
  }),
});
