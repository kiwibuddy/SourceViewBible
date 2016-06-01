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

const MINIMUM_PULL_THRESHOLD = 40;
const MINIMUM_RELEASE_THRESHOLD = 564;

export default class ScriptureView extends Component {
  state: {
    book: any,
    chapterNumber: number,
    scripture: any,
    previousScripture: any,
    showPreviousScripture: bool,
    nextScripture: any,
    showNextScripture: bool,
    loading: bool
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
      loading: false
    };
  }

  componentDidMount() {
    this._fetchScripture(this.state.book, this.state.chapterNumber);
  }

  render() {
    if (!this.state.scripture) return null;
    const scripture = eval(this.state.scripture);

    const previousScripture = this._renderPreviousScripture();
    const nextScripture = this._renderNextScripture();

    return (
      <View style={styles.container}>

        {previousScripture}

        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={styles.scriptureContainer}
          onScroll={this._onScroll}
          scrollEventThrottle={64}
        >
          <View style={styles.scriptureChapterContainer}>
            <Text style={styles.scriptureChapter}>{this.state.chapterNumber}</Text>
          </View>
          {scripture}
        </ScrollView>

        {nextScripture}

      </View>
    )
  }

  _renderPreviousScripture = () => {
    if (!this.state.showPreviousScripture) return null;

    return (
      <View style={{height: 100, backgroundColor: 'red'}}/>
    );
  };

  _renderNextScripture = () => {
    if (!this.state.showNextScripture) return null;

    return (
      <View style={[styles.scriptureChapterContainer, { backgroundColor: 'red'}]}>
        <Text style={styles.scriptureChapter}>{this.state.chapterNumber + 1}</Text>
      </View>
    );
  };

  _onScroll = (e: Object) => {
    if (this.state.loading) return;

    let distanceFromTop = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y;
    const distanceFromBottom = e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height - e.nativeEvent.contentOffset.y;

    if (distanceFromTop < -MINIMUM_PULL_THRESHOLD) {
      console.log(distanceFromTop);
      this.setState({showPreviousScripture: true, showNextScripture: false});

      if (distanceFromTop < -MINIMUM_RELEASE_THRESHOLD) {
        this._fetchScripture(this.state.book, this.state.chapterNumber - 1);
      }
    } else if (distanceFromBottom < -MINIMUM_PULL_THRESHOLD) {
      console.log(distanceFromBottom);
      this.setState({showPreviousScripture: false, showNextScripture: true});

      if (distanceFromBottom < -MINIMUM_RELEASE_THRESHOLD) {
        this._fetchScripture(this.state.book, this.state.chapterNumber + 1);
      }
    } else {
      this.setState({showPreviousScripture: false, showNextScripture: false});
    }
  };

  _fetchScripture(book: Object, chapterNumber: number) {
    this.setState({loading: true});

    Emdros.scripture(book, chapterNumber).then((result) => {
      const scripture = 'React.createElement(View, {}, ' + result.slice(0, -1) + ')';
      this.setState({
        book,
        chapterNumber,
        scripture,
        loading: false
      });
    }).catch((error) => {
      console.log("Error getting string " + error);
    });
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
