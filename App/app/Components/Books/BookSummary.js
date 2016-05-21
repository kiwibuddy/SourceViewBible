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
        <View style={styles.statisticsContainer}>
          <TouchableOpacity style={styles.statisticButton}>
            <Text style={styles.statisticButtonTitle}>0</Text>
            <Text style={styles.statisticButtonSubtitle}>Chapters</Text>
          </TouchableOpacity>

          <View style={styles.keyline} />

          <TouchableOpacity style={styles.statisticButton}>
            <Text style={styles.statisticButtonTitle}>0</Text>
            <Text style={styles.statisticButtonSubtitle}>Sources</Text>
          </TouchableOpacity>

          <View style={styles.keyline} />

          <TouchableOpacity style={styles.statisticButton}>
            <Text style={styles.statisticButtonTitle}>0</Text>
            <Text style={styles.statisticButtonSubtitle}>Spheres</Text>
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
  statisticsContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    borderBottomColor: Colors.separator,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statisticButton: {
    flex: 1,
    alignItems: 'center'
  },
  statisticButtonTitle: {
    fontSize: 24,
    color: Colors.tintColor,
  },
  statisticButtonSubtitle: {
    color: Colors.subtitle,
    fontSize: 12,
    marginBottom: 4,
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
