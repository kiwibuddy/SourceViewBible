/* @flow */
'use strict';

const React = require('react');
import { Component } from 'react';

import ReactNative from 'react-native';

const {
  Image,
  LayoutAnimation,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  WebView,
} = ReactNative;

import {
  Colors,
  Localizable,
  StyleSheet
} from '../../Common';

import { BACK, bookURL, readerSearchURL, readerSettingsURL, readerURL } from '../../Navigation';
import { NavigationHeader, NavigationBarButton, Toolbar, ToolbarButton } from '../../Components/Navigation';

const RNFS = require('react-native-fs');

import Emdros from '../../API/Emdros';
import { Book, Sphere } from '../../Database';

const HTML = require('./HTML');

import { Preference } from '../../Preferences';
import { ReaderBaseFontSize, ReaderBaseLineHeight, ReaderFontStepSize, ReaderWebFontConversion } from '../../Common/Constants';

class OccurrenceToolbar extends Component {
  render() {
    const { book, occurrenceIndex, occurrences, occurrencesRoute } = this.props;

    const current = occurrenceIndex + 1;
    const total = occurrences.length;

    let currentRoute = null;
    const occurrence = occurrences[occurrenceIndex];
    if (occurrence) {
      const book = occurrence.book;
      const bsoReference = Localizable.t('bso-reference', {book: book.name, source: occurrence.name, number: occurrence.number});
      currentRoute = readerURL({bookID: book.id, anchor: `source-${occurrence.name}-${occurrence.number}`, title: book.name, description: bsoReference});
    }

    let previousRoute = null;
    if (occurrenceIndex > 0) {
      const previousOccurrenceIndex = occurrenceIndex - 1;
      const previousOccurrence = occurrences[previousOccurrenceIndex];
      const book = previousOccurrence.book;
      const bsoReference = Localizable.t('bso-reference', {book: book.name, source: previousOccurrence.name, number: previousOccurrence.number});
      previousRoute = readerURL({bookID: book.id, anchor: `source-${previousOccurrence.name}-${previousOccurrence.number}`, title: book.name, description: bsoReference, occurrenceIndex: previousOccurrenceIndex, occurrences, occurrencesRoute});
    }

    let nextRoute = null;
    if (occurrenceIndex < total - 1) {
      const nextOccurrenceIndex = occurrenceIndex + 1;
      const nextOccurrence = occurrences[nextOccurrenceIndex];
      const book = nextOccurrence.book;
      const bsoReference = Localizable.t('bso-reference', {book: book.name, source: nextOccurrence.name, number: nextOccurrence.number});
      nextRoute = readerURL({bookID: book.id, anchor: `source-${nextOccurrence.name}-${nextOccurrence.number}`, title: book.name, description: bsoReference, occurrenceIndex: nextOccurrenceIndex, occurrences, occurrencesRoute});
    }

    return (
      <Toolbar>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <ToolbarButton
            disabled={previousRoute == null}
            imageSource={require('../../Images/common/previous.png')}
            onPress={() => this._navigate(previousRoute)}
          />
          <ToolbarButton
            disabled={nextRoute == null}
            imageSource={require('../../Images/common/next.png')}
            onPress={() => this._navigate(nextRoute)}
          />
        </View>
        <ToolbarButton
          title={Localizable.t('range-of', {current, total})}
          onPress={() => this._onPressOccurrences(currentRoute)}
          style={{marginLeft: -10}}
        />
        <ToolbarButton
          title={Localizable.t('done')}
          titleStyle={StyleSheet.styles.navigationBar.doneButtonTitle}
          onPress={() => this._navigate(currentRoute)}
          style={{paddingHorizontal: 0, marginHorizontal: 0, marginRight: -20}}
        />
      </Toolbar>
    );
  }

  _navigate = (route: Object) => {
    const options = (route !== BACK ? {replace: true} : null);
    this.props.navigate(route, options);
  };

  _onPressOccurrences = (currentRoute) => {
    const { occurrenceIndex, occurrences, occurrencesRoute } = this.props;

    occurrencesRoute.onPressBack = () => {
      this._navigate({...currentRoute, occurrenceIndex, occurrences, occurrencesRoute});
    }
    this._navigate(occurrencesRoute);
  }
}

type Props = {
  bookID: string,
  anchor?: string,
  navigate: Function,
};

type State = {
  scripture: any,
  loading: bool,
};

export default class Reader extends Component {
  static renderNavigationHeaderLeftComponent(props: Object) {
    return (
      <NavigationBarButton
        imageSource={require('../../Components/Navigation/Images/nav-search.png')}
        onPress={() => props.navigate(readerSearchURL({title: Localizable.t('search'), modal: true}))}
      />
    );
  }

  static renderNavigationHeaderTitleComponent(props: Object) {
    const book = Book.findByID(props.routeParams.bookID);
    return <NavigationHeader.Title onPress={() => props.navigate(bookURL({bookID: book.id, title: book.name}))}>{props.title}</NavigationHeader.Title>;
  }

  static renderNavigationHeaderRightComponent(props: Object) {
    return (
      <NavigationBarButton
        imageSource={require('../../Components/Navigation/Images/nav-filter.png')}
        onPress={() => props.navigate(readerSettingsURL({title: Localizable.t('settings'), modal: true}))}
      />
    );
  }

  static renderToolbar(props: Object) {
    const { occurrences } = props;
    if (!occurrences) return null;
    return <OccurrenceToolbar {...props} />;
  }

  props: Props;
  state: State;

  shouldFetchScripture: boolean = true;

  constructor(props: Object) {
    super(props);

    this.state = {
      scripture: null,
      loading: true,
    };
  }

  componentWillReceiveProps(nextProps: Object) {
    const { bookID, anchor } = nextProps;
    this._setScripture(bookID, anchor);
  }

  componentDidMount() {
    const { bookID, anchor } = this.props;
    this._setScripture(bookID, anchor);
  }

  componentWillUnmount() {
    this.shouldFetchScripture = false;
  }

  render() {
    if (this.state.loading) return this._renderLoading();

    const filterBar = this._renderFilterBar();

    const injectedJavaScript = this._renderInjectedJavascript();
    const key = (this.props.anchor ? `anchor-${this.props.anchor}` : 'webview');
    return (
      <View key={key} style={styles.container}>
        {filterBar}
        <WebView
          decelerationRate='normal'
          injectedJavaScript={injectedJavaScript}
          style={styles.webview}
          source={{html: this.state.scripture}}
        />
      </View>
    );
  }

  _renderLoading = () => {
    const key = (this.props.anchor ? `anchor-${this.props.anchor}` : 'webview');
    return (
      <View key={key} style={styles.container}>
        <WebView
          style={styles.webview}
          source={require('./Loading.html')}
        />
      </View>
    );
  };

  _renderFilterBar = () => {
    const spheres = Preference.objectForKey(Preference.Keys.Reader.spheres) || [];
    if (spheres.length == 0) return null;

    const sphereLabels = Sphere.whereIn(spheres).map(sphere => {
      const color = sphere.color();
      return (
        <View key={'sphere-' + sphere.id} style={[styles.filterLabelContainer, {backgroundColor: color}]}>
          <Text style={[styles.filterLabel]}>{sphere.name}</Text>
        </View>
      );
    });

    return (
      <View style={styles.filterBar}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {sphereLabels}
        </ScrollView>
        <TouchableOpacity style={styles.filterClear} onPress={this._onPressClearFilter}>
          <Image source={require('./Images/clear-btn.png')} />
        </TouchableOpacity>
      </View>
    );
  };

  _setScripture = (bookID: string, anchor?: string) => {
    const book = Book.findByID(bookID);

    const spheres = Preference.objectForKey(Preference.Keys.Reader.spheres) || [];
    const options = {monadSet: book.monadSet, spheres};

    this.setState({loading: true});
    Emdros.scripture(options).then((content) => {
      if (this.shouldFetchScripture) {
        const scripture = this._renderScripture(content);

        if (__DEV__) {
          this._debugScripture(scripture);
        }

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({
          scripture,
          loading: false
        });
      }
    });
  };

  _renderScripture = (content: string) => {
    const { bookID } = this.props;
    const book = Book.findByID(bookID);
    const isPsalms = this.props.bookID == 'psalms';

    let html = HTML.replace('{{BODY}}', content);
    html = html.replace(new RegExp('{{BOOK_NAME}}', 'g'), book.name);
    html = html.replace('{{IS_PSALMS}}', (isPsalms ? 'true' : 'false'));

    const fontStepSize = Preference.numberForKey(Preference.Keys.Reader.fontStepSize) || 0;
    const fontSize = Math.ceil((ReaderBaseFontSize + (fontStepSize * ReaderFontStepSize)) * ReaderWebFontConversion);
    const lineHeight = Math.ceil((ReaderBaseLineHeight + (fontStepSize * ReaderFontStepSize)) * ReaderWebFontConversion);

    html = html.replace('{{FONT_SIZE}}', fontSize.toString());
    html = html.replace('{{LINE_HEIGHT}}', lineHeight.toString());

    let showNumbers = Preference.booleanForKey(Preference.Keys.Reader.showNumbers);
    if (showNumbers == null) showNumbers = true;
    html = html.replace(new RegExp('{{NUMBER_DISPLAY}}', 'g'), showNumbers ? '' : 'display: none;');

    return html;
  };

  _renderInjectedJavascript = () => {
    if (!this.props.anchor) return null;

    const isPsalms = this.props.bookID == 'psalms';

    let anchor = this.props.anchor;
    let scrollOffset = 8;

    if (isPsalms && anchor.startsWith('chapter-')) {
      scrollOffset += 40;
      anchor = anchor.replace('chapter', 'verse') + '-0';

      if (anchor.endsWith('-119-0')) {
        anchor = anchor.replace('-119-0', '-119-1');
        scrollOffset += 48;
      }
    }

    const javascript = `\
      location.hash = '#${encodeURIComponent(anchor)}';
      document.getElementById('scripture').scrollTop = document.getElementById('scripture').scrollTop - ${scrollOffset};
    `;
    return javascript;
  };

  _onPressClearFilter = () => {
    const { bookID, anchor } = this.props;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Preference.setObjectForKey([], Preference.Keys.Reader.spheres);
    this._setScripture(bookID, anchor);
  };

  _debugScripture(scripture: string) {
    RNFS.writeFile('/tmp/Scripture.html', scripture, 'utf8')
    .then((success) => {
      console.log('Scripture written to /tmp/Scripture.html');
    })
    .catch((err) => {
      console.log(err.message);
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: 'white',
  },
  filterBar: {
    height: 30,
    backgroundColor: '#F9F9F9',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c8c7cc',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  filterLabelContainer: {
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 5,
    overflow: 'hidden',
    marginRight: 5,
  },
  filterLabel: {
    fontSize: 13,
    color: 'white',
  },
  filterClear: {
    position: 'absolute',
    right: 0,
  }
});
