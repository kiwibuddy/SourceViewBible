/* @flow */
'use strict';

import React, { Component } from 'react';

import ReactNative, {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  NavigationExperimental,
  Image
} from 'react-native';

const { Header: NavigationHeader } = NavigationExperimental;

import {
  Colors,
  StyleSheet,
  Localizable,
  Platform
} from '../../Common';

import { SourcesBarChart, SpheresBarChart, WordCloud } from '../Charts';

import Keyline from '../Common/Keyline';

class BookSummary extends Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        <WordCloud style={styles.wordCloud} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: NavigationHeader.HEIGHT,
  },
  wordCloud: {
    height: 200,
    backgroundColor: '#5633b3',
  },
  ...Platform.select({
      ios: {
      },
      android: {
      },
  })
});

export default BookSummary;
