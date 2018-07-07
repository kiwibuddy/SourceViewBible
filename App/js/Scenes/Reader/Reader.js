/* @flow */
'use strict';

const React = require('react');
import { Component } from 'react';

import ReactNative from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Share from 'react-native-share';

const { LayoutAnimation, Platform, View } = ReactNative;

import { Localizable, StyleSheet } from '../../Common';
import WebView from '../../Components/Common/WebView';

import { bookURL, bookmarkURL, readerSettingsURL } from '../../Navigation';
import { NavigationHeader, NavigationBarButton, Toolbar } from '../../Components/Navigation';

import DefaultToolbar from '../../Components/Navigation/DefaultToolbar';

import FilterBar from './FilterBar';
import ActionToolbar from './ActionToolbar';
import OccurrenceToolbar from './OccurrenceToolbar';
import Loading from './Loading';

const RNFS = require('react-native-fs');

import Emdros from '../../API/Emdros';
import { Book } from '../../Database';

const HTML = require('./HTML');

import { Bookmark, Preference, ReferenceDescription } from '../../Preferences';
import { ReaderBaseFontSize, ReaderBaseLineHeight, ReaderFontStepSize, ReaderWebFontConversion } from '../../Common/Constants';

type Props = {
  bookID: string,
  anchor?: string,
  canGoBack: boolean,
  canGoForward: boolean,
  didGoBack: ?boolean,
  navigate: Function,
  occurrences?: any,
  occurrenceIndex?: any,
  occurrencesRoute?: any,
};

type State = {
  bookID: string,
  anchor?: string,
  scripture: any,
  loading: boolean,
  references: any,
  showOcccurences: boolean,
};

export default class Reader extends Component {
  static renderNavigationHeaderTitleComponent(props: Object) {
    const book = Book.findByID(props.routeParams.bookID);
    return <NavigationHeader.Title onPress={() => props.navigate(bookURL({ bookID: book.id, title: book.name }))}>{props.title}</NavigationHeader.Title>;
  }

  static renderNavigationHeaderRightComponent(props: Object) {
    return (
      <NavigationBarButton
        imageSource={require('../../Components/Navigation/Images/nav-filter.png')}
        onPress={() => props.navigate(readerSettingsURL({ title: Localizable.t('settings'), modal: true }))}
      />
    );
  }

  static wantsFullScreenLayout = true;

  props: Props;
  state: State;

  shouldFetchScripture: boolean = true;
  webview = null;

  constructor(props: Object) {
    super(props);

    this.state = {
      bookID: props.bookID,
      anchor: props.anchor,
      scripture: null,
      loading: true,
      references: null,
      showOcccurences: props.occurrences && props.occurrences.length > 0,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const { bookID, anchor, occurrences, occurrenceIndex } = nextProps;
    this._setScripture(bookID, anchor, occurrences, occurrenceIndex);
  }

  componentWillMount() {
    const { bookID, anchor, occurrences, occurrenceIndex } = this.props;
    this._setScripture(bookID, anchor, occurrences, occurrenceIndex);
  }

  componentWillUnmount() {
    this.shouldFetchScripture = false;
  }

  render() {
    const toolbar = this._renderToolbar();
    if (this.state.loading) return <Loading toolbar={toolbar} />;

    const injectedJavaScript = this._renderInjectedJavascript();
    const key = this.props.anchor ? `anchor-${this.props.anchor}` : 'webview';
    const source = { html: this.state.scripture };
    if (Platform.OS === 'android') {
      source.baseUrl = 'sourceview://ignored';
    }

    return (
      <View key={key} style={styles.container}>
        <FilterBar onPressClear={this._onPressClearFilter} />
        <WebView
          ref={webview => {
            this.webview = webview;
          }}
          key="scripture"
          decelerationRate="normal"
          injectedJavaScript={injectedJavaScript}
          onMessage={this._onMessage}
          style={styles.webview}
          source={source}
        />
        {toolbar}
      </View>
    );
  }

  _renderToolbar = () => {
    const { canGoBack, canGoForward, navigate } = this.props;
    const { references, showOcccurences } = this.state;

    if (showOcccurences) {
      const book = Book.findByID(this.state.bookID);
      return (
        <OccurrenceToolbar
          key="OccurrenceToolbar"
          {...this.props}
          book={book}
          onNavigate={this._onNavigateOccurrence}
          onPressDone={this._onPressOccurrencesDone}
        />
      );
    }

    if (references && references.length > 0) {
      return (
        <ActionToolbar
          key="ActionToolbar"
          onBookmark={() => this._onBookmark(references)}
          onCancel={this._onCancelAction}
          onHighlight={() => this._onHighlight(references)}
          onShare={() => this._onShare(references)}
          references={references}
        />
      );
    }

    return <DefaultToolbar key="DefaultToolbar" canGoBack={canGoBack} canGoForward={canGoForward} navigate={navigate} />;
  };

  _renderScripture = (content: string) => {
    const { bookID } = this.props;
    const book = Book.findByID(bookID);
    const isPsalms = this.props.bookID === 'psalms';

    let html = HTML.replace('{{BODY}}', content);
    html = html.replace(/{{BOOK_NAME}}/g, book.name);
    html = html.replace('{{IS_PSALMS}}', isPsalms ? 'true' : 'false');

    if (isPsalms) {
      html = html.replace(/>(Psalm )(\d+?)</g, ' id="chapter-$2">$1$2<');
    }

    const fontStepSize = Preference.numberForKey(Preference.Keys.Reader.fontStepSize) || 0;
    const fontSize = Math.ceil((ReaderBaseFontSize + fontStepSize * ReaderFontStepSize) * ReaderWebFontConversion);
    const lineHeight = Math.ceil((ReaderBaseLineHeight + fontStepSize * ReaderFontStepSize) * ReaderWebFontConversion);

    html = html.replace('{{FONT_SIZE}}', fontSize.toString());
    html = html.replace('{{LINE_HEIGHT}}', lineHeight.toString());

    let showNumbers = Preference.booleanForKey(Preference.Keys.Reader.showNumbers);
    if (showNumbers == null) showNumbers = true;
    html = html.replace(/{{NUMBER_DISPLAY}}/g, showNumbers ? '' : 'display: none;');

    return html;
  };

  _renderInjectedJavascript = () => {
    if (this.state.loading) return null;
    const anchor = this.state.anchor;
    const scroll = Preference.objectForKey(Preference.Keys.Reader.scroll);
    const { didGoBack, occurrenceIndex, occurrences } = this.props;

    let occurrenceScript = '';
    if (occurrences && occurrences.length > 0) {
      const occurrence = occurrences[occurrenceIndex];
      occurrenceScript = `selectOccurrences(${occurrence.firstMonad}, ${occurrence.lastMonad});`;
    }

    if (didGoBack && scroll && scroll.bookID === this.state.bookID) {
      return `document.body.scrollTop = ${scroll.top}; ${occurrenceScript}`;
    } else if (anchor) {
      return `
        var documentReadyCallback = function() {
            var hash = '${encodeURIComponent(anchor)}';
            document.getElementById(hash).scrollIntoView();
            document.getElementById('scripture').scrollTop = document.getElementById('scripture').scrollTop - 8;
            ${occurrenceScript}
        };

        if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
          documentReadyCallback();
        } else {
          document.addEventListener("DOMContentLoaded", documentReadyCallback);
        }
      `;
    }
  };

  _onPressClearFilter = () => {
    const { bookID, anchor, occurrences, occurrenceIndex } = this.props;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Preference.setObjectForKey([], Preference.Keys.Reader.spheres);
    this._setScripture(bookID, anchor, occurrences, occurrenceIndex, true);
  };

  _onPressOccurrencesDone = () => {
    this.setState({ showOcccurences: false });
    this._postMessage({
      action: 'done-occurrences',
    });
  };

  _onNavigateOccurrence = (occurrence: Object) => {
    const anchor = `monad-${occurrence.firstMonad}`;
    this.setState({ anchor });

    this._postMessage({
      action: 'navigate-occurrence',
      anchor,
      firstMonad: occurrence.firstMonad,
      lastMonad: occurrence.lastMonad,
    });
  };

  _onMessage = event => {
    const { bookID } = this.state;
    const data = JSON.parse(event.nativeEvent.data);
    switch (data.action) {
      case 'select': {
        const references = data.verses.map(reference => {
          const chapter = reference.chapter;
          const verse = reference.verse;
          const firstMonad = reference.firstMonad;
          const lastMonad = reference.lastMonad;
          return {
            bookID,
            chapter,
            verse,
            firstMonad,
            lastMonad,
          };
        });

        this.setState({ references });
        break;
      }

      case 'scroll': {
        const top = data.top;
        Preference.setObjectForKey({ bookID, top }, Preference.Keys.Reader.scroll);
        break;
      }

      default:
        console.log('_onMessage', data);
        break;
    }
  };

  _postMessage = data => {
    if (this.webview) {
      this.webview.postMessage(JSON.stringify(data));
    }
  };

  _onBookmark = references => {
    const bookmarks = Bookmark.whereReferences(references, { type: Bookmark.Type.Bookmark });
    if (bookmarks.length > 0) {
      bookmarks.forEach(bookmark => {
        bookmark.delete();
      });
      this._postMessage({
        action: 'unhighlight',
      });
    } else {
      this.props.navigate(bookmarkURL({ bookmarkID: null, bookID: this.state.bookID, title: Localizable.t('bookmark'), references, modal: true }));
    }

    this.setState({ references: null });
  };

  _onCancelAction = () => {
    this.setState({ references: null });
    this._postMessage({
      action: 'cancel',
    });
  };

  _onHighlight = references => {
    const highlights = Bookmark.whereReferences(references, { type: Bookmark.Type.Highlight });

    if (highlights.length > 0) {
      highlights.forEach(highlight => {
        highlight.delete();
      });
      this._postMessage({
        action: 'unhighlight',
      });
    } else {
      Bookmark.highlight(references);
      this._postMessage({
        action: 'highlight',
      });
    }

    this.setState({ references: null });
  };

  async _onShare(references) {
    let scripture = '';
    for (let reference of references) {
      const monadSet = {
        first: reference.firstMonad,
        last: reference.lastMonad,
      };
      const content = await Emdros.scripture({ monadSet, stylesheet: 'occurrence' });
      scripture += content;
    }

    const book = Book.findByID(this.state.bookID);
    scripture += `\n${ReferenceDescription(book, references)}`;

    this.setState({ references: null });
    this._postMessage({
      action: 'cancel',
    });

    Share.open({
      message: scripture,
      url: 'http://onelink.to/svbapp',
    })
      .then(() => {})
      .catch(() => {});
  }

  _setScripture = (bookID: string, anchor?: string, occurrences?: any, occurrenceIndex?: number, force?: boolean = false) => {
    const book = Book.findByID(bookID);

    const spheres = Preference.objectForKey(Preference.Keys.Reader.spheres) || [];
    const highlights = Bookmark.bookHighlights(bookID);

    const options = { monadSet: book.monadSet, spheres, occurrences, occurrenceIndex, highlights };

    if (force || bookID !== this.state.bookID || anchor !== this.state.anchor) {
      this.setState({ loading: true });
    }

    Emdros.scripture(options).then(content => {
      if (this.shouldFetchScripture) {
        const scripture = this._renderScripture(content);

        if (__DEV__ && DeviceInfo.getModel() === 'Simulator') {
          this._debugScripture(scripture);
        }

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        this.setState({
          bookID,
          anchor,
          scripture,
          loading: false,
        });
      }
    });
  };

  _debugScripture(scripture: string) {
    RNFS.writeFile('/tmp/Scripture.html', scripture, 'utf8')
      .then(() => {
        console.log('Scripture written to /tmp/Scripture.html');
      })
      .catch(err => {
        console.log(err.message);
      });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  webview: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: Toolbar.HEIGHT,
  },
});
