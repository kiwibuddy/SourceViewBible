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

export default class ScriptureView extends Component {
  state: {
    scripture: any
  };

  constructor(props: Object) {
    super(props);

    this.state = {
      scripture: null
    };
  }

  componentDidMount() {
    Emdros.scripture(this.props.book, this.props.chapterNumber).then((result) => {
      const scripture = 'React.createElement(View, {}, ' + result.slice(0, -1) + ')';
      this.setState({scripture});
    }).catch((error) => {
      console.log("Error getting string " + error);
    });
  }

  render() {
    if (!this.state.scripture) return null;
    const scripture = eval(this.state.scripture);

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scriptureContainer}>
          <View style={styles.scriptureChapterContainer}>
            <Text style={styles.scriptureChapter}>{this.props.chapterNumber}</Text>
          </View>
          {scripture}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: NavigationHeader.HEIGHT,
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
    width: 1,
    alignSelf: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.sources.narrator,
    paddingVertical: 10,
    paddingHorizontal: 50,
    marginTop: 30,
    marginBottom: 30,
  },
  scriptureChapter: {
    alignSelf: 'center',
    justifyContent: 'center',
    color: Colors.sources.narrator,
    fontFamily: 'Georgia',
    lineHeight: 24,
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
