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

class BookSummary extends Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        <WordCloud style={styles.wordCloud} />
        <View style={styles.statsContainer}>
          <TouchableOpacity style={{flex: 1}}>
          </TouchableOpacity>
          <View style={styles.keyline} />
          <TouchableOpacity style={{flex: 1}}>
          </TouchableOpacity>
          <View style={styles.keyline} />
          <TouchableOpacity style={{flex: 1}}>
          </TouchableOpacity>
        </View>
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
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    marginTop: 10,
    borderBottomColor: Colors.separator,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  keyline: {
    flex:0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: Colors.separator
  },
  ...Platform.select({
      ios: {
      },
      android: {
      },
  })
});

export default BookSummary;
