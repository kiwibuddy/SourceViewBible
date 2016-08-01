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

import { readerURL } from '../../Navigation';

const RNFS = require('react-native-fs');

import Emdros from '../../API/Emdros';

const HTML = require('./HTML');

type Props = {
  book: Object,
  anchor?: string,
  navigate: Function,
};

type State = {
  scripture: any,
  loading: bool,
};

export default class ScriptureView extends Component {
  props: Props;
  state: State;

  shouldFetchScripture: bool = true;

  constructor(props: Object) {
    super(props);

    this.state = {
      scripture: null,
      loading: false,
    };
  }

  componentWillReceiveProps(nextProps: Object) {
    const { book, anchor } = nextProps;
    this._setScripture(book, anchor);
  }

  componentDidMount() {
    const { book, anchor } = this.props;
    this._setScripture(book, anchor);
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

  _setScripture = (book: Object, anchor?: string) => {
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
