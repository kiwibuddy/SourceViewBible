/* @flow */
'use strict';

const React = require('react');
import { Component } from 'react';

import ReactNative from 'react-native';

const {
  View,
  WebView,
} = ReactNative;

import {
  Colors,
  Localizable,
  StyleSheet
} from '../../Common';

import { occurrencesURL, readerSearchURL, readerSettingsURL, readerURL } from '../../Navigation';
import * as Navigation from '../../Components/Navigation';

const RNFS = require('react-native-fs');

import Emdros from '../../API/Emdros';
import { Book } from '../../Database';

const HTML = require('./HTML');

import { Preference } from '../../Preferences';
import { ReaderBaseFontSize, ReaderFontStepSize, ReaderWebFontConversion } from '../../Common/Constants';

const NavigationBar = (props: Props) => {
  const book = Book.findByID(props.bookID);
  return (
    <Navigation.NavigationBar title={book.name}>
      <Navigation.NavigationBarButton
        imageSource={require('../../Components/Navigation/Images/nav-search.png')}
        onPress={() => {props.navigate(readerSearchURL({modal: true}))}}
        style={{position: 'absolute', left: 0}}
      />
      <Navigation.NavigationBarButton
        imageSource={require('../../Components/Navigation/Images/nav-filter.png')}
        onPress={() => {props.navigate(readerSettingsURL({title: Localizable.t('settings'), modal: true}))}}
        style={{position: 'absolute', right: 0}}
      />
    </Navigation.NavigationBar>
  );
};

class OccurrenceToolbar extends Component {
  render() {
    const { book, card, occurrenceIndex, occurrences } = this.props;

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
      previousRoute = readerURL({bookID: book.id, anchor: `source-${previousOccurrence.name}-${previousOccurrence.number}`, title: book.name, description: bsoReference, card, occurrenceIndex: previousOccurrenceIndex, occurrences});
    }

    let nextRoute = null;
    if (occurrenceIndex < total - 1) {
      const nextOccurrenceIndex = occurrenceIndex + 1;
      const nextOccurrence = occurrences[nextOccurrenceIndex];
      const book = nextOccurrence.book;
      const bsoReference = Localizable.t('bso-reference', {book: book.name, source: nextOccurrence.name, number: nextOccurrence.number});
      nextRoute = readerURL({bookID: book.id, anchor: `source-${nextOccurrence.name}-${nextOccurrence.number}`, title: book.name, description: bsoReference, card, occurrenceIndex: nextOccurrenceIndex, occurrences});
    }

    const occurrencesRoute = occurrencesURL({title: Localizable.t('passages'), card, modal: true});

    return (
      <Navigation.Toolbar style={styles.toolbar}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Navigation.ToolbarButton
            disabled={previousRoute == null}
            imageSource={require('../../Images/common/previous.png')}
            onPress={() => this._navigate(previousRoute)}
          />
          <Navigation.ToolbarButton
            disabled={nextRoute == null}
            imageSource={require('../../Images/common/next.png')}
            onPress={() => this._navigate(nextRoute)}
          />
        </View>
        <Navigation.ToolbarButton
          title={Localizable.t('range-of', {current, total})}
          onPress={() => {}}
          onPress={() => this._navigate(occurrencesRoute)}
          style={{marginLeft: -10}}
        />
        <Navigation.ToolbarButton
          title={Localizable.t('done')}
          titleStyle={StyleSheet.styles.navigationBar.doneButtonTitle}
          onPress={() => this._navigate(currentRoute)}
          style={{paddingHorizontal: 0, marginHorizontal: 0, marginRight: -20}}
        />
      </Navigation.Toolbar>
    );
  }

  _navigate = (route: Object) => {
    this.props.navigate(route, {replace: true});
  };
}

function renderToolbar(props: Object) {
  const { occurrences } = props;
  if (!occurrences) return null;
  return <OccurrenceToolbar {...props} />;
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
  static NavigationBar = NavigationBar;
  static renderToolbar = renderToolbar;

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
    if (!this.state.scripture) return null;

    const injectedJavaScript = this._renderInjectedJavascript();
    const key = (this.props.anchor ? `anchor-${this.props.anchor}` : 'webview');
    return (
      <WebView
        key={key}
        decelerationRate='normal'
        injectedJavaScript={injectedJavaScript}
        scalesPageToFit={false}
        style={styles.webview}
        source={{html: this.state.scripture}}
      />
    );
  }

  _setScripture = (bookID: string, anchor?: string) => {
    const book = Book.findByID(bookID);

    const spheres = Preference.objectForKey(Preference.Keys.Reader.spheres) || [];
    const options = {monadSet: book.monadSet, spheres};

    Emdros.scripture(options).then((content) => {
      if (this.shouldFetchScripture) {
        const scripture = this._renderScripture(content);

        if (__DEV__) {
          this._debugScripture(scripture);
        }

        this.setState({
          scripture,
          loading: false
        });
      }
    });
  };

  _renderScripture = (content: string) => {
    let html = HTML.replace('{{BODY}}', content);

    const fontStepSize = Preference.numberForKey(Preference.Keys.Reader.fontStepSize) || 0;
    const fontSize = parseInt((ReaderBaseFontSize + (fontStepSize * ReaderFontStepSize)) * ReaderWebFontConversion);
    html = html.replace('{{FONT_SIZE}}', fontSize.toString());

    let showNumbers = Preference.booleanForKey(Preference.Keys.Reader.showNumbers);
    if (showNumbers == null) showNumbers = true;
    if (!showNumbers) {
      html = html.replace(new RegExp('{{NUMBER_DISPLAY}}', 'g'), 'display: none;');
    }

    return html;
  };

  _renderInjectedJavascript = () => {
    const { anchor } = this.props;
    if (!anchor) return null;

    const javascript = `\
      location.hash = '#${encodeURIComponent(anchor)}';
      document.getElementById('scripture').scrollTop = document.getElementById('scripture').scrollTop - 8;
    `;
    return javascript;
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
  toolbar: {

  },
});
