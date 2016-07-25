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
} = ReactNative;

import {
  Colors,
  StyleSheet
} from '../../Common';

import Emdros from '../../API/Emdros';

import { readerURL } from '../../Navigation';

const MINIMUM_PULL_THRESHOLD = 20;
const MINIMUM_RELEASE_THRESHOLD = 80;

const SCROLLVIEW_REF = 'ScrollView';

const ReleaseDirection = {
  'PREVIOUS': 'previous',
  'NEXT': 'next'
}

export default class ScriptureView extends Component {
  waitingForRelease: bool = false;
  releaseDirection: any = null;
  scrollViewHeight: number = 0;
  shouldFetchScripture: bool = true;

  state: {
    book: any,
    chapter: any,
    scripture: any,
    previousScripture: any,
    showPreviousScripture: bool,
    nextScripture: any,
    showNextScripture: bool,
    loading: bool,
  };

  constructor(props: Object) {
    super(props);
    const { book, chapter } = props;

    this.state = {
      book: book,
      chapter: chapter,
      scripture: null,
      previousScripture: null,
      showPreviousScripture: false,
      nextScripture: null,
      showNextScripture: false,
      loading: false,
    };
  }

  componentDidMount() {
    const { chapter } = this.state;
    this._fetchScripture({monadSet: chapter.monadSet}).then((scripture) => {
      if (this.shouldFetchScripture) {
        this.setState({
          scripture,
          loading: false
        });

        this._fetchPreviousScripture();
      }
    });
  }

  componentWillUnmount() {
    this.shouldFetchScripture = false;
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
          contentContainerStyle={styles.scriptureContainer}
          onScroll={this._onScroll}
          onContentSizeChange={this._onContentSizeChange}
          onLayout={(event) => this.scrollViewHeight = event.nativeEvent.layout.height}
          scrollEventThrottle={64}
          onResponderGrant={this._onResponderGrant}
          onResponderRelease={this._onResponderRelease}
        >
          {previousScripture}

          {scripture}

          {nextScripture}
        </ScrollView>
      </View>
    )
  }

  _hasPreviousScripture = () => {
    return this.state.chapter.chapterNumber > 1;
  };

  _hasNextScripture = () => {
    return (this.state.chapter.chapterNumber) < this.state.book.chapters.length;
  };

  _renderPreviousScripture = () => {
    if (!this._hasPreviousScripture() || !this.state.showPreviousScripture || !this.state.previousScripture) return null;

    const previousScripture = eval(this.state.previousScripture);
    return (
      <View style={{height: 0, top: -MINIMUM_PULL_THRESHOLD - 10, justifyContent: 'flex-end'}}>
        {previousScripture}
      </View>
    );
  };

  _renderNextScripture = () => {
    if (!this._hasNextScripture() || !this.state.showNextScripture) return null;

    return (
      <View style={[{position: 'absolute', bottom: -100, left: 0, right: 0}]}>

     </View>
    );
  };

  _onResponderGrant = () => {
    this.waitingForRelease = false;
  };

  _onResponderRelease = () => {
    if (this.waitingForRelease) {
      this.waitingForRelease = false;

      const book = this.state.book;
      const chapterNumber = (this.releaseDirection === ReleaseDirection.PREVIOUS ? this.state.chapter.chapterNumber - 1 : this.state.chapter.chapterNumber + 1);
      const chapter = book.chapters[chapterNumber - 1];

      this.setState({
        loading: true,
        showPreviousScripture: false,
        previousScripture: null,
        showNextScripture: false
      });

      this.props.navigate(readerURL({bookID: book.id, chapterNumber, title: book.name}), {replace: true});

      this._fetchScripture({monadSet: chapter.monadSet}).then((scripture) => {
        this.setState({
          chapter,
          scripture,
          loading: false
        });

        this._fetchPreviousScripture();
      });
    }
  };

  _onScroll = (e: Object) => {
    if (this.state.loading) return;

    let distanceFromTop = e.nativeEvent.contentInset.top + e.nativeEvent.contentOffset.y;
    const distanceFromBottom = e.nativeEvent.contentSize.height - e.nativeEvent.layoutMeasurement.height - e.nativeEvent.contentOffset.y;

    if (this._hasPreviousScripture() && distanceFromTop < -MINIMUM_PULL_THRESHOLD) {
      this.setState({showPreviousScripture: true, showNextScripture: false});

      if (distanceFromTop < -MINIMUM_RELEASE_THRESHOLD) {
        this.waitingForRelease = true;
        this.releaseDirection = ReleaseDirection.PREVIOUS;
      }
    } else if (this._hasNextScripture() && distanceFromBottom < -MINIMUM_PULL_THRESHOLD) {
      this.setState({showPreviousScripture: false, showNextScripture: true});

      if (distanceFromBottom < -MINIMUM_RELEASE_THRESHOLD) {
        this.waitingForRelease = true;
        this.releaseDirection = ReleaseDirection.NEXT;
      }
    } else {
      this.setState({showPreviousScripture: false, showNextScripture: false});
    }
  };

  _onContentSizeChange = (width: number, height: number) => {
    let scrollY = 0;
    if (this.releaseDirection === ReleaseDirection.PREVIOUS && this.scrollViewHeight > 0) {
      scrollY = height - this.scrollViewHeight;
    }

    this.refs[SCROLLVIEW_REF].scrollTo({y: scrollY, animated: false});
  };

  _fetchScripture = (options: Object) => {
    return Emdros.scripture(options);
  };

  _fetchPreviousScripture = () => {
    const { chapter } = this.state;

    if (this._hasPreviousScripture()) {
      const monadSet = {
        first: chapter.monadSet.first - 100,
        last: chapter.monadSet.first - 1
      };

      this._fetchScripture({monadSet}).then((scripture) => {
        this.setState({
          previousScripture: scripture
        });
      });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    borderColor: Colors.sources.narrator.tint,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginTop: 30,
    marginBottom: 30,
  },
  scriptureChapter: {
    alignSelf: 'center',
    justifyContent: 'center',
    color: Colors.sources.narrator.tint,
    fontFamily: 'Georgia',
    lineHeight: 26,
    fontSize: 26,
  },
  sourceColorRed: {
    color: Colors.sources.divine.tint,
  },
  sourceColorBlack: {
    color: Colors.sources.narrator.tint,
  },
  sourceColorGreen: {
    color: Colors.sources.lead.tint,
  },
  sourceColorBlue: {
    "color": Colors.sources.support.tint
  },
});
