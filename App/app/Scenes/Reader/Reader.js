/* @flow */
'use strict';

const React = require('react');
import { Component } from 'react';

import ReactNative from 'react-native';

const {
  WebView,
} = ReactNative;

import {
  Colors,
  StyleSheet
} from '../../Common';

import { readerSearchURL } from '../../Navigation';
import * as Navigation from '../../Components/Navigation';

const RNFS = require('react-native-fs');

import Emdros from '../../API/Emdros';
import { Book } from '../../Database';

const HTML = require('./HTML');

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
        onPress={() => {}}
        style={{position: 'absolute', right: 0}}
      />
    </Navigation.NavigationBar>
  );
};

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

  props: Props;
  state: State;

  shouldFetchScripture: bool = true;

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

    return (
      <WebView
        decelerationRate="normal"
        injectedJavaScript={injectedJavaScript}
        style={styles.container}
        source={{html: this.state.scripture}}
      />
    );
  }

  _setScripture = (bookID: string, anchor?: string) => {
    const book = Book.findByID(bookID);
    Emdros.scripture({monadSet: book.monadSet}).then((content) => {
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
    return HTML.replace("{{BODY}}", content);
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
    backgroundColor: 'white',
  },
});
