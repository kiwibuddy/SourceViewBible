/* @flow */
'use strict';

const React = require('react');
import { Component } from 'react';

import ReactNative from 'react-native';
import DeviceInfo from 'react-native-device-info';

const {
  Image,
  LayoutAnimation,
  Platform,
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
import { NavigationHeader, NavigationBarButton } from '../../Components/Navigation';

import OccurrenceToolbar from './OccurrenceToolbar';

import {
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';

const RNFS = require('react-native-fs');

import Emdros from '../../API/Emdros';
import { Book, Sphere } from '../../Database';

const HTML = require('./HTML');
const LOADING_HTML = require('./Loading.html');

import { Preference } from '../../Preferences';
import { ReaderBaseFontSize, ReaderBaseLineHeight, ReaderFontStepSize, ReaderWebFontConversion } from '../../Common/Constants';

type Props = {
  bookID: string,
  anchor?: string,
  navigate: Function,
  occurrences?: any,
  occurrenceIndex?: any,
};

type State = {
  bookID: string,
  anchor?: string,
  scripture: any,
  loading: bool,
};

export default class Reader extends Component {
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
  webview = null;

  constructor(props: Object) {
    super(props);

    this.state = {
      bookID: props.bookID,
      anchor: props.anchor,
      scripture: null,
      loading: true,
    };
  }

  componentWillReceiveProps(nextProps: Object) {
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
    if (this.state.loading) return this._renderLoading();

    const injectedJavaScript = this._renderInjectedJavascript();
    const key = (this.props.anchor ? `anchor-${this.props.anchor}` : 'webview');

    const filterBar = this._renderFilterBar();

    return (
      <View key={key} style={styles.container}>
        {filterBar}
        <WebView
          ref={webview => { this.webview = webview; }}
          key="scripture"
          decelerationRate="normal"
          injectedJavaScript={injectedJavaScript}
          onMessage={this._onMessage}
          style={styles.webview}
          source={{html: this.state.scripture}}
        />
      </View>
    );
  }

  _renderLoading = () => {
    return (
      <View style={[styles.container, {flex: 1, flexDirection: 'column', padding: 20}]}>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .05}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .10}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .08}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} />
        </View>
        <View style={[styles.textPlaceholderContainer, {marginBottom: 20}]}>
          <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .80}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .05}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .10}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} />
        </View>
        <View style={[styles.textPlaceholderContainer, {marginBottom: 20}]}>
          <View style={[styles.textPlaceholder, {flex: 1}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .20}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .05}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .08}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .10}]} />
        </View>
        <View style={[styles.textPlaceholderContainer, {marginBottom: 20}]}>
          <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: 1}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .20}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .05}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .08}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .10}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .05}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .08}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .10}]} />
        </View>
        <View style={[styles.textPlaceholderContainer, {marginBottom: 20}]}>
          <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: 1}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .20}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .05}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
          <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .08}]} />
        </View>
        <View style={styles.textPlaceholderContainer}>
        <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: .10}]} />
        </View>
        <View style={[styles.textPlaceholderContainer, {marginBottom: 20}]}>
          <View style={[styles.textPlaceholder, {flex: 1}]} /><View style={[styles.whiteSpace, {flex: 1}]} />
        </View>
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

  _setScripture = (bookID: string, anchor?: string, occurrences?: any, occurrenceIndex?: number, force?: boolean = false) => {
    const book = Book.findByID(bookID);

    const spheres = Preference.objectForKey(Preference.Keys.Reader.spheres) || [];
    const options = {monadSet: book.monadSet, spheres, occurrences, occurrenceIndex};

    if (force || bookID !== this.state.bookID || anchor !== this.state.anchor) {
      this.setState({loading: true});
    }

    Emdros.scripture(options).then((content) => {
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
    html = html.replace(/{{BOOK_NAME}}/g, book.name);
    html = html.replace('{{IS_PSALMS}}', (isPsalms ? 'true' : 'false'));

    if (isPsalms) {
      html = html.replace(/>(Psalm )(\d+?)</g, ' id="chapter-$2">$1$2<');
    }

    const fontStepSize = Preference.numberForKey(Preference.Keys.Reader.fontStepSize) || 0;
    const fontSize = Math.ceil((ReaderBaseFontSize + (fontStepSize * ReaderFontStepSize)) * ReaderWebFontConversion);
    const lineHeight = Math.ceil((ReaderBaseLineHeight + (fontStepSize * ReaderFontStepSize)) * ReaderWebFontConversion);

    html = html.replace('{{FONT_SIZE}}', fontSize.toString());
    html = html.replace('{{LINE_HEIGHT}}', lineHeight.toString());

    let showNumbers = Preference.booleanForKey(Preference.Keys.Reader.showNumbers);
    if (showNumbers == null) showNumbers = true;
    html = html.replace(/{{NUMBER_DISPLAY}}/g, showNumbers ? '' : 'display: none;');

    return html;
  };

  _renderInjectedJavascript = () => {
    if (!this.props.anchor || this.state.loading) return null;

    const isPsalms = this.props.bookID == 'psalms';

    let anchor = this.props.anchor;
    let scrollOffset = 8;

    const javascript = `\
      location.hash = '#${encodeURIComponent(anchor)}';
      document.getElementById('scripture').scrollTop = document.getElementById('scripture').scrollTop - ${scrollOffset};
    `;
    return javascript;
  };

  _onPressClearFilter = () => {
    const { bookID, anchor, occurrences, occurrenceIndex } = this.props;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Preference.setObjectForKey([], Preference.Keys.Reader.spheres);
    this._setScripture(bookID, anchor, occurrences, occurrenceIndex, true);
  };

  _onMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    console.log('_onMessage', data);
  };

  _postMessage = (data) => {
    if (this.webview) {
      this.webview.postMessage(data);
    }
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
    backgroundColor: '#FFF',
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
    elevation: 2,
    borderTopColor: Platform.OS === 'ios' ? 0 : 'rgba(0, 0, 0, .15)',
    borderTopWidth: Platform.OS === 'ios' ? 0 : 1,
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
  },
  textPlaceholderContainer: {
    height: 10,
    marginVertical: 5,
    flexDirection: 'row',
  },
  textPlaceholder: {
    backgroundColor: '#EDEDED',
    height: 10,
  },
  whiteSpace: {
    backgroundColor: '#FFF',
    height: 10,
  },
});
