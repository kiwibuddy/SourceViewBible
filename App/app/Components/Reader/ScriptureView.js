/* @flow */
'use strict';

const React = require('react');
import { Component } from 'react';

import ReactNative from 'react-native';

const {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  NavigationExperimental
} = ReactNative;

const { Header: NavigationHeader } = NavigationExperimental;

import {
  Colors,
  StyleSheet
} from '../../Common';

import Emdros from '../../API/Emdros';

const MINIMUM_PULL_THRESHOLD = 20;
const MINIMUM_RELEASE_THRESHOLD = 64;

const SCROLLVIEW_REF = 'ScrollView';

const ReleaseDirection = {
  'PREVIOUS': 'previous',
  'NEXT': 'next'
}

export default class ScriptureView extends Component {
  waitingForRelease: bool = false;
  releaseDirection: any = null;

  state: {
    book: any,
    chapterNumber: number,
    scripture: any,
    previousScripture: any,
    showPreviousScripture: bool,
    nextScripture: any,
    showNextScripture: bool,
    loading: bool,
  };

  constructor(props: Object) {
    super(props);

    this.state = {
      book: props.book,
      chapterNumber: props.chapterNumber,
      scripture: null,
      previousScripture: null,
      showPreviousScripture: false,
      nextScripture: null,
      showNextScripture: false,
      loading: false,
    };
  }

  componentDidMount() {
    this._fetchScripture(this.state.book, this.state.chapterNumber).then((scripture) => {
      this.setState({
        scripture,
        loading: false
      });
    });
  }

  render() {
    if (!this.state.scripture) return null;
    const scripture = eval(this.state.scripture);

    const previousScripture = this._renderPreviousScripture();
    const nextScripture = this._renderNextScripture();

    return (
      <View style={styles.container}>
        <ScrollView
          ref={SCROLLVIEW_REF}
          style={styles.contentContainer}
          contentContainerStyle={styles.scriptureContainer}
          onScroll={this._onScroll}
          scrollEventThrottle={64}
          onResponderGrant={this._onResponderGrant}
          onResponderRelease={this._onResponderRelease}
        >
          {previousScripture}

          <View style={styles.scriptureChapterContainer}>
            <Text style={styles.scriptureChapter}>{this.state.chapterNumber}</Text>
          </View>
          {scripture}

          {nextScripture}
        </ScrollView>
      </View>
    )
  }

  _renderPreviousScripture = () => {
    if (!this.state.showPreviousScripture) return null;

    return (
      <View style={{position:'absolute', top: -100, height: 100, left: 0, right: 0, backgroundColor: 'red'}}/>
    );
  };

  _renderNextScripture = () => {
    if (!this.state.showNextScripture) return null;

    return (
      <View style={[styles.scriptureChapterContainer, { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'red'}]}>
        <Text style={styles.scriptureChapter}>{this.state.chapterNumber + 1}</Text>
      </View>
    );
  };

  _onResponderGrant = () => {
    this.waitingForRelease = false;
  };

  _onResponderRelease= () => {
    if (this.waitingForRelease) {
      this.waitingForRelease = false;

      const book = this.state.book;
      const chapterNumber = (this.releaseDirection === ReleaseDirection.PREVIOUS ? this.state.chapterNumber - 1 : this.state.chapterNumber + 1);

      this.setState({
        loading: true,
        showPreviousScripture: false,
        showNextScripture: false
      });

      this._fetchScripture(book, chapterNumber).then((scripture) => {
        this.setState({
          book,
          chapterNumber,
          scripture,
          loading: false
        }, () => {
          this.refs[SCROLLVIEW_REF].scrollTo({x: 0, y: 0, animated: false});
        });
      });
    }
  };

  _onScroll = (e: Object) => {
    if (this.state.loading) return;

    let distanceFromTop = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y;
    const distanceFromBottom = e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height - e.nativeEvent.contentOffset.y;

    if (distanceFromTop < -MINIMUM_PULL_THRESHOLD) {
      this.setState({showPreviousScripture: true, showNextScripture: false});

      if (distanceFromTop < -MINIMUM_RELEASE_THRESHOLD) {
        this.waitingForRelease = true;
        this.releaseDirection = ReleaseDirection.PREVIOUS;
      }
    } else if (distanceFromBottom < -MINIMUM_PULL_THRESHOLD) {
      this.setState({showPreviousScripture: false, showNextScripture: true});

      if (distanceFromBottom < -MINIMUM_RELEASE_THRESHOLD) {
        this.waitingForRelease = true;
        this.releaseDirection = ReleaseDirection.NEXT;
      }
    } else {
      this.setState({showPreviousScripture: false, showNextScripture: false});
    }
  };

  _fetchScripture(book: Object, chapterNumber: number) {
    return Emdros.scripture(book, chapterNumber);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: NavigationHeader.HEIGHT,
    backgroundColor: 'white',
  },
  contentContainer: {
    position: 'absolute',
    top: NavigationHeader.HEIGHT,
    left: 0,
    bottom: 0,
    right: 0
  },
  scriptureContainer: {
    marginVertical: 20,
    marginHorizontal: 25,
    paddingBottom: 25,
  },
  scripture: {
    fontFamily: 'Hoefler Text',
    fontSize: 18,
    lineHeight: 30,
  },
  scriptureChapterContainer: {
    alignSelf: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.sources.narrator,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginTop: 30,
    marginBottom: 30,
  },
  scriptureChapter: {
    alignSelf: 'center',
    justifyContent: 'center',
    color: Colors.sources.narrator,
    fontFamily: 'Georgia',
    lineHeight: 26,
    fontSize: 26,
  },
  sourceColorRed: {
    color: Colors.sources.divine,
  },
  sourceColorBlack: {
    color: Colors.sources.narrator,
  },
  sourceColorGreen: {
    color: Colors.sources.lead,
  },
  sourceColorBlue: {
    "color": Colors.sources.support
  },
});
