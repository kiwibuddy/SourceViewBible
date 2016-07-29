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

export default class ScriptureView extends Component {
  shouldFetchScripture: bool = true;

  state: {
    book: any,
    chapter: any,
    scripture: any,
    loading: bool,
  };

  constructor(props: Object) {
    super(props);
    const { book, chapter } = props;

    this.state = {
      book: book,
      chapter: chapter,
      scripture: null,
      loading: false,
    };
  }

  componentWillReceiveProps(nextProps: Object) {
    const { book, chapter } = nextProps;
    this._setScripture(book, chapter);
  }

  componentDidMount() {
    const { book, chapter } = this.state;
    this._setScripture(book, chapter);
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

  _setScripture = (book: Object, chapter: Object) => {
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
    const { chapter } = this.props;
    return `location.hash = '#chapter-${chapter.chapterNumber}'`;
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
