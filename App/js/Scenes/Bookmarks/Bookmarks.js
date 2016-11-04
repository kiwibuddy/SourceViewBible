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
import { RelativeDate } from '../../Common/NumberHelper';

import { NavigationHeader, NavigationBarButton, Toolbar, ToolbarButton } from '../../Components/Navigation';

import { BACK, bookmarkURL, readerURL, spheresURL, sphereInAppPurchaseURL } from '../../Navigation';

import SegmentedControl from '../../Components/Common/SegmentedControl';

import Emdros from '../../API/Emdros';
import { Bookmark, History, Preference } from '../../Preferences';

const SEGMENTS = [Localizable.t('history'), Localizable.t('highlights'), Localizable.t('bookmarks')];
const SEGMENT_INDEXES = {
  HISTORY: 0,
  HIGHLIGHTS: 1,
  BOOKMARKS: 2,
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
  selectedSegmentIndex: number,
  highlights: Array<Object>,
  bookmarks: Array<Object>
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
      selectedSegmentIndex,
      bookmarks: [],
      highlights: []
    }
  }

  async componentDidMount() {
    await this._getReferences();

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
          enableEmptySections={false}
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
        style={styles.segmentedControl}
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
    const icon = (bookmark.hasNote ? require('./Images/note.png') : require('./Images/bookmark.png'));
    const noteStyle = (bookmark.hasNote ? styles.noteContainer : null);
    const noteButtonTitle = (bookmark.hasNote ? Localizable.t('view-note') : Localizable.t('add-note'));
    const note = (bookmark.hasNote ? <Text style={StyleSheet.styles.cell.titlemedium}>{bookmark.note}</Text> : null);
    return (
      <View>
        <View style={styles.row}>
          <Image source={icon} style={[styles.icon, {alignSelf: 'flex-start',}]} />
          <View style={styles.rowContent}>
            <TouchableOpacity style={styles.referenceContainer} onPress={() => this._navigateReader(bookmark.url)}>
              <View>
                <Text numberOfLines={2} style={styles.body}>{bookmark.scripture}</Text>
                <Text style={StyleSheet.styles.cell.subtitle}>{bookmark.description}</Text>
              </View>
              <Text style={[StyleSheet.styles.cell.subtitle, styles.date]}>{RelativeDate(bookmark.createdAt)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={noteStyle} onPress={() => this._navigateBookmark(bookmark)}>
              {note}
              <Text style={styles.button}>{noteButtonTitle}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

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

  _renderHighlightRow = (highlight: Object) => {
    return (
      <View style={styles.row}>
        <Image source={require('./Images/highlight.png')} style={[styles.icon, {alignSelf: 'flex-start',}]} />
        <View style={styles.rowContent}>
          <TouchableOpacity style={styles.referenceContainer} onPress={() => this._navigateReader(highlight.url)}>
            <View>
              <Text numberOfLines={5} style={styles.body}>{highlight.scripture}</Text>
              <Text style={StyleSheet.styles.cell.subtitle}>{highlight.description}</Text>
            </View>
            <Text style={[StyleSheet.styles.cell.subtitle, styles.date]}>{RelativeDate(highlight.createdAt)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  _navigate = (route: Object) => {
    this.props.navigate(route, {replace: true});
  };

  _navigateReader = (url: Object) => {
    this.props.navigate(readerURL(url), {replace: true});
  }

  _navigateBookmark = (bookmark: Object) => {
    const bookID = bookmark.references[0].bookID;
    this.props.navigate(bookmarkURL({bookmarkID: bookmark.id, bookID, title: Localizable.t('bookmark'), modal: true}))
  }

  _getDataSource = (segmentIndex: number) => {
    const { highlights, bookmarks } = this.state;

    switch (segmentIndex) {
      case SEGMENT_INDEXES.HISTORY:
        const { rows, sections } = this._getHistory();
        return this.state.dataSource.cloneWithRowsAndSections(rows, sections);

      case SEGMENT_INDEXES.HIGHLIGHTS:
        return this.state.dataSource.cloneWithRowsAndSections({highlights});

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
        }

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

  async _getReferences() {
    const highlights = [];
    const bookmarks = [];
    for (let bookmark of Bookmark.all()) {
      let scripture = '';
      for (let reference of bookmark.references) {
        const monadSet = {
          first: reference.firstMonad,
          last: reference.lastMonad
        };
        const content = await Emdros.scripture({monadSet, stylesheet: 'occurrence'});
        scripture += content;
      }

      switch(bookmark.type) {
        case Bookmark.Type.Highlight:
          highlights.push({
            ...bookmark,
            url: bookmark.url,
            description: bookmark.description,
            scripture
          });
          break;

        case Bookmark.Type.Bookmark:
          bookmarks.push({
            ...bookmark,
            hasNote: bookmark.hasNote,
            url: bookmark.url,
            description: bookmark.description,
            scripture
          });
          break;
      }
    }

    this.setState({highlights, bookmarks});
  }

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
          marginTop: 8,
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
          marginTop: 8,
        },
      },
  }),
});
