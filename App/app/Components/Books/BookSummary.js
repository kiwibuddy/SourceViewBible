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
            <Text style={styles.buttonSubtitle}>Chapters</Text>
          </TouchableOpacity>

          <View style={styles.keyline} />

          <TouchableOpacity style={styles.statisticButton}>
            <Text style={styles.statisticButtonTitle}>0</Text>
            <Text style={styles.buttonSubtitle}>Sources</Text>
          </TouchableOpacity>

          <View style={styles.keyline} />

          <TouchableOpacity style={styles.statisticButton}>
            <Text style={styles.statisticButtonTitle}>0</Text>
            <Text style={styles.buttonSubtitle}>Spheres</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sourcesContainer}>
          <TouchableOpacity style={styles.sourceButton}>
            <Image source={require('../../Images/avatars/narrator.png')} style={styles.sourceImage}/>
            <Text style={styles.buttonSubtitle}>Narrator</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sourceButton}>
            <Image source={require('../../Images/avatars/divine.png')} style={[styles.sourceImage, {tintColor: Colors.sources.god}]}/>
            <Text style={styles.buttonSubtitle}>God</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sourceButton}>
            <Image source={require('../../Images/avatars/human-male.png')} style={[styles.sourceImage, {tintColor: Colors.sources.lead}]}/>
            <Text style={styles.buttonSubtitle}>Lead</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.readButton}>
          <Text style={styles.readButtonTitle}>0 min read</Text>
        </TouchableOpacity>
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
  buttonSubtitle: {
    color: Colors.subtitle,
    fontSize: 12,
    marginBottom: 4,
  },
  sourcesContainer: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 4,
  },
  sourceButton: {
    flex: 1,
    margin: 8,
    alignItems: 'center',
  },
  sourceImage: {
    width: 20,
    height: 20,
    margin: 4,
  },
  readButton: {
    // backgroundColor: Colors.tintColor,
    alignSelf: 'center',
    // height: 30,
    marginVertical: 20
  },
  readButtonTitle: {
    backgroundColor: Colors.tintColor,
    color: 'white',
    fontSize: 18,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderColor: Colors.tintColor,
    borderRadius: 20,
    borderWidth: 1,
    overflow:'hidden'
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
