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
      const scripture = 'React.createElement(ScrollView, {}, ' + result.slice(0, -1) + ')';
      this.setState({scripture});
      console.log('got scripture');
    }).catch((error) => {
      console.log("Error getting string " + error);
    });
  }

  render() {
    if (!this.state.scripture) return null;
    const scripture = eval(this.state.scripture);

    return (
      <View style={styles.container}>
        {scripture}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: NavigationHeader.HEIGHT,
    backgroundColor: 'white'
  },
  scripture: {
    fontSize: 18
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
