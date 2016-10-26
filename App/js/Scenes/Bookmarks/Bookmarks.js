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

const SEGMENTS = [Localizable.t('history'), Localizable.t('bookmarks'), Localizable.t('highlights')];
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
    if (this.state.selectedSegmentIndex == SEGMENT_INDEXES.HISTORY) {
      const title = sectionID;
      return (
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeaderTitle}>{title}</Text>
        </View>
      );
    } else if (sectionID === 'bookmarks') {
      return (
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeaderTitle}>{Localizable.t('my-bookmarks')}</Text>
        </View>
      );
    }

    return null;
  };

  _renderRow = (data: Object, sectionID: any) => {
    switch (this.state.selectedSegmentIndex) {
      case SEGMENT_INDEXES.HISTORY:
        return this._renderHistoryRow(data);

      case SEGMENT_INDEXES.HIGHLIGHTS:
        return this._renderHighlightRow(data);

      default:
        if (sectionID === 'defaults') {
          return this._renderDefaultBookmarkRow(data);
        } else {
          return this._renderBookmarkRow(data);
        }
    }
  };

  _renderDefaultBookmarkRow = (bookmark: Object) => {
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
  };

  _renderBookmarkRow = (bookmark: Object) => {
    return (
      <View>
        <View style={styles.row}>
          <Image source={require('./Images/note.png')} style={[styles.icon, {alignSelf: 'flex-start',}]} />
          <View style={styles.rowContent}>
            <TouchableOpacity style={styles.referenceContainer}>
              <View>
                <Text numberOfLines={2} style={styles.body}>6 Then God said, “Let there be a space between the waters, to separate the waters of the heavens from the</Text>
                <Text style={StyleSheet.styles.cell.subtitle}>Genesis 1:6</Text>
              </View>
              <Text style={[StyleSheet.styles.cell.subtitle, styles.date]}>1h</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.noteContainer}>
              <Text style={StyleSheet.styles.cell.titlemedium}>And with these words, God set in to motion all that was to come and established his authority over all of it.</Text>
              <Text style={styles.button}>View note</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <Image source={require('./Images/bookmark.png')} style={[styles.icon, {alignSelf: 'flex-start',}]} />
          <View style={styles.rowContent}>
            <TouchableOpacity style={styles.referenceContainer}>
              <View>
                <Text numberOfLines={2} style={styles.body}>6 Then God said, “Let there be a space between the waters, to separate the waters of the heavens from the</Text>
                <Text style={StyleSheet.styles.cell.subtitle}>Genesis 1:6</Text>
              </View>
              <Text style={[StyleSheet.styles.cell.subtitle, styles.date]}>1h</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.button}>Add note</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <Image source={require('./Images/highlight.png')} style={[styles.icon, {alignSelf: 'flex-start',}]} />
          <View style={styles.rowContent}>
            <TouchableOpacity style={styles.referenceContainer}>
              <View>
                <Text numberOfLines={5} style={styles.body}>27 John replied, John the Baptist 10
No one can receive anything unless God gives it from heaven. 28 You yourselves know how plainly I told you, ‘I am not the Messiah. I am only here to prepare the way for him.’</Text>
                <Text style={StyleSheet.styles.cell.subtitle}>John 3:27-28</Text>
              </View>
              <Text style={[StyleSheet.styles.cell.subtitle, styles.date]}>Yesterday</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
        return this.state.dataSource.cloneWithRowsAndSections({highlights: [{}]});

      default:
        const defaults = [
          {path: '/Discover', title: Localizable.t('discover')},
          {path: '/Books', title: Localizable.t('books')},
          {path: '/Sources', title: Localizable.t('sources.text')},
          {path: '/Spheres', title: Localizable.t('spheres.text')},
          {path: '/About', title: Localizable.t('about-sourceview'), modal: true}
        ];

        if (__DEV__) {
          defaults.push({path: '/Onboarding', title: 'Onboarding', modal: true});
          defaults.push(sphereInAppPurchaseURL({title: 'Spheres IAP', redirect: spheresURL({title: 'Spheres'}), modal: true}));
          defaults.push(bookmarkURL({title: 'Bookmark', bookmarkID: 'new', modal: true}));
        }

        const bookmarks = [
          {}
        ];

        return this.state.dataSource.cloneWithRowsAndSections({defaults, bookmarks}, ['defaults', 'bookmarks']);
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 15,
    paddingRight: 15,
  },
  rowContent: {
    flex: 1,
    flexDirection: 'column',
    paddingRight: 40,
  },
  icon: {
    tintColor: Colors.tint,
    marginRight: 10,
  },
  body: {
    fontFamily: 'Georgia',
    paddingBottom: 5,
    color: '#59626A',
    fontSize: 15,
    lineHeight: 24,
  },
  date: {
    flex: 0,
    lineHeight: 24,
    textAlign: 'right',
    width: 60,
    marginLeft: 8,
  },
  button: {
    color: '#CF1E00',
    fontSize: 15,
    paddingVertical: 8,
  },
  referenceContainer: {
    flexDirection: 'row',
    marginRight: 25,
    marginTop: -5,
  },
  noteContainer: {
    marginVertical: 15,
    borderLeftColor: '#EDEDED',
    borderLeftWidth: 4,
    paddingLeft: 8,
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
